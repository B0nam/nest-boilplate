import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Get,
  Param,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Controller('file')
export class FileController {
  @Get('uploads')
  async listUploads() {
    const uploadsDir = './storage/uploads';
    const files = await fs.promises.readdir(uploadsDir);
    return {
      statusCode: HttpStatus.OK,
      message: 'Arquivos de upload listados com sucesso',
      data: files,
    };
  }

  @Get('downloads')
  async listDownloads() {
    const downloadsDir = './storage/downloads';
    const files = await fs.promises.readdir(downloadsDir);
    return {
      statusCode: HttpStatus.OK,
      message: 'Arquivos de download listados com sucesso',
      data: files,
    };
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './storage/uploads/',
        filename: (req, file, cb) => {
          const fileExtName = extname(file.originalname);
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          cb(null, `${randomName}${fileExtName}`);
        },
      }),
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return {
      statusCode: HttpStatus.OK,
      message: 'Arquivo enviado com sucesso!',
      data: file.filename,
    };
  }

  @Get('download/:filename')
  async downloadFile(
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = `./storage/downloads/${filename}`;
    return res.download(filePath, filename, (err) => {
      if (err) {
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
          message: 'Erro ao baixar o arquivo',
        });
      }
    });
  }
}
