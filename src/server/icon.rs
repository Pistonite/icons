use crate::Palette;
use image::codecs::png::PngEncoder;
use image::{io::Reader as ImageReader, DynamicImage, GenericImage, GenericImageView};
use image::{ColorType, ImageEncoder};
use std::io;
use std::path::Path;
/// 64x64 output
const SIZE: usize = 64;

#[derive(Debug, Clone, Copy)]
pub enum PxlType {
    Transparent,
    FrameOutline,
    FrameFill,
    CenterOutline,
    CenterFill,
    ModOutline,
    ModFill,
}

#[derive(Debug, Clone, Copy)]
pub struct Icon {
    data: [[PxlType; SIZE]; SIZE],
}

impl Icon {
    pub fn add_overlay(&mut self, other: &Icon) {
        for x in 0..SIZE {
            for y in 0..SIZE {
                if let PxlType::Transparent = other.data[x][y] {
                    continue;
                }
                self.data[x][y] = other.data[x][y];
            }
        }
    }

    pub fn from_file<P>(path: P) -> io::Result<Self>
    where
        P: AsRef<Path>,
    {
        let image = ImageReader::open(path)?
            .decode()
            .map_err(|e| io::Error::new(io::ErrorKind::Other, e.to_string()))?;
        let mut data = [[PxlType::Transparent; SIZE]; SIZE];
        #[allow(clippy::needless_range_loop)]
        for x in 0..SIZE {
            #[allow(clippy::needless_range_loop)]
            for y in 0..SIZE {
                let pixel = image.get_pixel(x as u32, y as u32);
                if pixel[3] == 0 {
                    continue;
                }
                let r = pixel[0];
                let g = pixel[1];
                let b = pixel[2];
                match (r, g, b) {
                    (0x00, 0x80, 0x00) => data[x][y] = PxlType::FrameOutline,
                    (0xd9, 0x36, 0x00) => data[x][y] = PxlType::FrameFill,
                    (0x00, 0x00, 0x00) => data[x][y] = PxlType::CenterOutline,
                    (0x80, 0x80, 0x80) => data[x][y] = PxlType::CenterFill,
                    (0x00, 0x00, 0xff) => data[x][y] = PxlType::ModOutline,
                    (0xfd, 0xfd, 0xfd) => data[x][y] = PxlType::ModFill,
                    _ => {}
                }
            }
        }
        Ok(Self { data })
    }

    pub fn colorize(&self, palette: &Palette) -> Result<Vec<u8>, &'static str> {
        let mut image = DynamicImage::new_rgba8(SIZE as u32, SIZE as u32);
        #[allow(clippy::needless_range_loop)]
        for x in 0..SIZE {
            #[allow(clippy::needless_range_loop)]
            for y in 0..SIZE {
                let pixel = self.data[x][y];
                let color = match pixel {
                    PxlType::Transparent => continue,
                    PxlType::FrameOutline => palette.frame_outline,
                    PxlType::FrameFill => palette.frame_fill,
                    PxlType::CenterOutline => palette.center_outline,
                    PxlType::CenterFill => palette.center_fill,
                    PxlType::ModOutline => palette.mod_outline,
                    PxlType::ModFill => palette.mod_fill,
                };

                image.put_pixel(x as u32, y as u32, color.into());
            }
        }
        let mut buffer = Vec::new();
        PngEncoder::new(&mut buffer)
            .write_image(image.as_bytes(), SIZE as u32, SIZE as u32, ColorType::Rgba8)
            .ok()
            .ok_or("Failed to encode image")?;
        Ok(buffer)
    }
}
