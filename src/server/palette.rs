pub struct Palette {
    pub frame_outline: [u8; 4],
    pub frame_fill: [u8; 4],
    pub center_outline: [u8; 4],
    pub center_fill: [u8; 4],
    pub mod_outline: [u8; 4],
    pub mod_fill: [u8; 4],
}

impl Palette {
    pub async fn from_hex_async(colors: &HexColors) -> Option<Self> {
        Some(Self {
            frame_outline: decode_hex(&colors.frame_outline)?,
            frame_fill: decode_hex(&colors.frame_fill)?,
            center_outline: decode_hex(&colors.center_outline)?,
            center_fill: decode_hex(&colors.center_fill)?,
            mod_outline: decode_hex(&colors.mod_outline)?,
            mod_fill: decode_hex(&colors.mod_fill)?,
        })
    }
}

pub struct HexColors {
    pub frame_outline: String,
    pub frame_fill: String,
    pub center_outline: String,
    pub center_fill: String,
    pub mod_outline: String,
    pub mod_fill: String,
}

impl HexColors {
    pub fn from_str_slice(colors: &[&str]) -> Option<Self> {
        if colors.len() != 6 {
            return None;
        }
        Some(Self {
            frame_outline: colors[0].to_string(),
            frame_fill: colors[1].to_string(),
            center_outline: colors[2].to_string(),
            center_fill: colors[3].to_string(),
            mod_outline: colors[4].to_string(),
            mod_fill: colors[5].to_string(),
        })
    }
}

fn decode_hex(hex: &str) -> Option<[u8; 4]> {
    if hex.len() != 6 {
        return None;
    }
    let mut bytes = [0; 4];
    bytes[3] = 255;
    for i in 0..3 {
        bytes[i] = match u8::from_str_radix(&hex[i * 2..i * 2 + 2], 16) {
            Ok(byte) => byte,
            Err(_) => return None,
        };
    }
    Some(bytes)
}
