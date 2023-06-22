use std::env;
use std::str::FromStr;
use tide::http::Mime;
use tide::security::CorsMiddleware;

mod server;
use server::*;

const IMAGE_CACHE_AGE: u32 = 60 * 60 * 24 /* 1 day */;
const OTHER_CACHE_AGE: u32 = 60 * 60 /* 1 hour */;

#[async_std::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    simple_logger::init_with_level(log::Level::Info).unwrap();
    log::info!("Starting server");
    let args = env::args().collect::<Vec<_>>();

    let port = if args.len() < 2 {
        8000
    } else {
        args[1].parse::<u16>()?
    };
    let address = format!("0.0.0.0:{port}");
    log::info!("Address: {address}");

    let static_dir = if args.len() < 3 {
        "target/frontend/"
    } else {
        &args[2]
    };
    if !static_dir.ends_with('/') {
        panic!("static_dir must end with a slash");
    }

    log::info!("Static Dir: {static_dir}");
    log::info!("Creating state");
    let state = State::new()?;

    log::info!("Setting up routes");
    let mut app = tide::with_state(state);
    log::info!("Setting up CORS");
    app.with(CorsMiddleware::new());
    log::info!("Setting up logging");
    app.with(tide::log::LogMiddleware::new());
    
    log::info!("Setting up /icon");
    app.at("/icon/:icon").get(get_icon);
    log::info!("Setting up /icons");
    app.at("/icons").get(get_icons);
    log::info!("Setting up static files");
    app.at("/").serve_dir(static_dir)?;
    log::info!("Setting up index.html");
    app.at("/").serve_file(format!("{}index.html", static_dir))?;
    log::info!("Ready to start listening");
    app.listen(address).await?;
    Ok(())
}

fn not_found() -> tide::Error {
    tide::Error::from_str(404, "Not found")
}

fn internal_error() -> tide::Error {
    tide::Error::from_str(500, "Internal server error")
}

async fn get_icon(req: tide::Request<State>) -> tide::Result {
    let icon_string = req.param("icon").ok().ok_or_else(not_found)?;
    // icon_string is group.name.modifier.colorx6.png
    let icon_parts = icon_string.split('.').collect::<Vec<_>>();
    if icon_parts.len() != 10 || icon_parts[9] != "png" {
        return Err(not_found());
    }
    let icon_name = format!("{}/{}", icon_parts[0], icon_parts[1]);
    let modifier = icon_parts[2];
    let colors = HexColors::from_str_slice(&icon_parts[3..9]).unwrap();
    let icon = match req.state().make_icon(&icon_name, modifier, &colors).await {
        Ok(icon) => icon,
        Err(_) => return Err(not_found()),
    };

    let res = tide::Response::builder(200)
        .body(icon)
        .content_type(Mime::from_str("image/x-png").unwrap())
        .header("Cache-Control", format!("public, max-age={IMAGE_CACHE_AGE}"))
        .header("Expires", IMAGE_CACHE_AGE.to_string())
        .build();

    Ok(res)
}

async fn get_icons(req: tide::Request<State>) -> tide::Result {
    let icon_names = req.state().get_icon_names().await;
    let json = serde_json::to_string(&icon_names).ok().ok_or_else(internal_error)?;

    let res = tide::Response::builder(200)
        .body(json)
        .content_type(Mime::from_str("application/json").unwrap())
        .header("Cache-Control", format!("public, max-age={OTHER_CACHE_AGE}"))
        .header("Expires", OTHER_CACHE_AGE.to_string())
        .build();

    Ok(res)
}