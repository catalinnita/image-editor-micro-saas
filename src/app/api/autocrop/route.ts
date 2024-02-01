import jimp from "jimp";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

type RGBA = {
  r: number,
  g: number,
  b: number,
  a: number,
}

function sameColor(current: RGBA, start: RGBA, treshold=50) {
  if (current.r < start.r - treshold || current.g < start.g - treshold || current.b < start.b - treshold ) {
    return false
  }

  if (current.r > start.r + treshold || current.g > start.g + treshold || current.b > start.b + treshold) {
    return false
  }

  return true
}

export async function GET(
  req: NextRequest,
) {
   
  if (req.method === 'GET') {
    try {
        const imagePath = req.nextUrl.searchParams.get("image") || ''

        const fileName = path.basename(imagePath);
        const image = await jimp.read(imagePath);
        const testImage = await jimp.read(imagePath);
        const margin = 50

        testImage.grayscale()
        testImage.posterize(4)
        testImage.contrast(0.3)

        const w = testImage.bitmap.width
        const h = testImage.bitmap.height

        const startColor = jimp.intToRGBA(testImage.getPixelColor(0,0))
        let xl = 0
        let xr = w
        let yt = 0
        let yb = h

        testImage.scan(0, 0, w, h, function (x, y) {
          const pColor = jimp.intToRGBA(testImage.getPixelColor(x,y))
          // xl
          if (!sameColor(pColor, startColor) && ( xl === 0 || x < xl )) {
            xl = x
          }
          // xr
          if (!sameColor(pColor, startColor) && ( xr === w || x > xr )) {
            xr = x
          }
          // yt
          if (!sameColor(pColor, startColor) && ( yt === 0 || y < yt )) {
            yt = y
          }
          // yb
          if (!sameColor(pColor, startColor) && ( yb === h || y > yb )) {
            yb = y
          }
        })
        
        const xs = xl-margin > 0 ? xl-margin : xl
        const ys = yt-margin > 0 ? yt-margin : yt
        const wi = xr+margin < w ? (xr-xl)+margin*2 : w-xs
        const he = yb+margin < h ? (yb-yt)+margin*2 : h-ys
        
        image.crop(xs, ys, wi, he)

        const resHeaders = new Headers()
        resHeaders.set("Content-type", "image/jpg",)
        resHeaders.set("Content-Disposition", "filename=" + fileName)

        const buffer = await image.getBufferAsync(jimp.MIME_JPEG)

        return new NextResponse(buffer, {
          status: 200,
          headers: resHeaders
        })

      } catch (err: any) {
        console.log(err);
        return new Response(
          JSON.stringify({ error: { statusCode: 500, message: err.message } }),
          {
            status: 500
          }
        );
      }
    } else {
      return new Response('Method Not Allowed', {
        headers: { Allow: 'POST' },
        status: 405
      });
    }
       
}
