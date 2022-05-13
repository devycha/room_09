import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Response, Request } from 'express';
import { CurrentFlashes } from 'src/common/decorators/current-flash.decorator';

import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/models/user.model';
import { UsersService } from 'src/users/users.service';
import { BooksService } from './books.service';
import { UploadBookDto } from './dtos/upload-book.dto';

@Controller('books')
export class BooksController {
  constructor(
    private readonly booksService: BooksService,
    private readonly usersService: UsersService,
  ) {}
  @Get()
  async getBooks(
    @CurrentFlashes() currentFlash,
    @CurrentUser() currentUser: User,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      req.flash('fail', '로그인이 필요한 서비스입니다.');
      return res.redirect('/login');
    }
    const books = await this.booksService.findAllBooks();
    return res.render('books/books', { currentUser, books });
  }
  @Post()
  async createBook(
    @CurrentUser() currentUser: User,
    @Body() uploadBookDto: UploadBookDto,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      return res.redirect('/login');
    }
    const newBook = await this.booksService.createBook(uploadBookDto);
    return res.redirect(`/books/${newBook.id}`);
  }

  @Get('/:id')
  async getBookPage(
    @CurrentUser() currentUser: User,
    @Param('id') bookId: string,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      return res.redirect('/login');
    }
    const book = await this.booksService.findBookByIdWithSeller(bookId);
    res.render('books/book', { book, currentUser });
  }

  @Delete('/:id')
  async removeBook(
    @CurrentUser() currentUser: User,
    @Param('id') bookId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!currentUser) {
      return res.redirect('/login');
    }
    const result = await this.booksService.removeBook(currentUser.id, bookId);
    if (result.success) {
      req.flash('success', result.message);
      return res.redirect('/books');
    } else {
      req.flash('fail', result.message);
      return res.redirect('/books');
    }
  }
}
