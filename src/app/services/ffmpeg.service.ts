import { Injectable } from '@angular/core';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

@Injectable({
  providedIn: 'root'
})
export class FfmpegService {
  isReady = false
  private ffmpeg

  constructor() {
    this.ffmpeg = createFFmpeg({ log: true })
  }
  async init() {
    if (this.isReady) {
      return
    }
    await this.ffmpeg.load()

    this.isReady = true
  }

  async getScreenshot(file: File) {
    const data = await fetchFile(file)
    this.ffmpeg.FS('writeFile', file.name, data)

    const seconds = [1, 2, 3]
    const comands: string[] = []

    seconds.forEach(second => {
      comands.push(
        //input
        '-i', file.name,
        //output options
        '-ss', `00:00:${second}`,
        '-frames:v', '1',
        '-filter:v', 'scale=510:-1',
        //output
        `output_0${second}.png`
      )
    })


    await this.ffmpeg.run(
      ...comands
      // //input
      // '-i', file.name,
      // //output options
      // '-ss', '00:00:01',
      // '-frames:v', '1',
      // '-filter:v', 'scale=510:-1',
      // //output
      // 'output_01.png'
    )


    const screenshots: string[] = []

    seconds.forEach(second => {
      const screenshotFile = this.ffmpeg.FS(
        'readFile', `output_0${second}.png`
      )
      const screenshotBlob = new Blob(
        [screenshotFile.buffer], {
        type: 'imege/png'
      }
      )

      const screenshotURL = URL.createObjectURL(screenshotBlob)
      screenshots.push(screenshotURL)
    })
    return screenshots

  }
}
