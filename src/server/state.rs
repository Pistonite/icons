use crate::{Icon, HexColors, Palette};
use std::collections::HashMap;
use std::fs;
use std::io;
use std::path::Path;

#[derive(Debug, Clone)]
pub struct State {
    pub icons: HashMap<String, Icon>,
    pub modifiers: HashMap<String, Icon>,
}

impl State {
    pub fn new() -> io::Result<Self> {
        log::info!("Loading icons");
        let mut icons = HashMap::new();
        load_icons_in_directory("./img/icons", "", &mut icons)?;
        log::info!("Loading modifiers");
        let mut modifiers = HashMap::new();
        load_icons_in_directory("./img/modifiers", "", &mut modifiers)?;
        Ok(Self { icons, modifiers })
    }

    pub async fn make_icon(&self, name: &str, modifier: &str, colors: &HexColors) -> Result<Vec<u8>, &'static str> {
        let mut icon = self.icons.get(name).cloned().ok_or("Icon not found")?;

        if modifier != "none" {
            let modifier = self.modifiers.get(modifier).ok_or("Modifier not found")?;
            icon.add_overlay(modifier);
        }

        let palette = Palette::from_hex_async(colors).await.ok_or("Invalid color")?;
        icon.colorize(&palette)
    }

    pub async fn get_icon_names(&self) -> Vec<String> {
        self.icons.keys().cloned().collect()
    }
}

fn load_icons_in_directory<P>(
    dir: P,
    name_path: &str,
    out: &mut HashMap<String, Icon>,
) -> io::Result<()>
where
    P: AsRef<Path>,
{
    let dir = dir.as_ref();

    for entry in fs::read_dir(dir)? {
        let entry = entry?;
        let filename = entry.file_name();
        let subpath = filename.to_string_lossy();
        let subpath = subpath.strip_suffix(".png").unwrap_or(&subpath);
        let path = entry.path();
        let name = if name_path.is_empty() {
            subpath.to_string()
        } else {
            format!("{}/{}", name_path, subpath)
        };
        if path.is_dir() {
            load_icons_in_directory(path, &name, out)?;
        } else {
            let icon = Icon::from_file(path)?;
            out.insert(name, icon);
        }
    }
    Ok(())
}
