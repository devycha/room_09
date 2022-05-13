import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UploadBookDto } from './dtos/upload-book.dto';
import { Book, BookDocument } from './models/book.model';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}
  async findAllBooks() {
    const books = await this.bookModel.find().exec();
    return books;
  }

  async createBook(uploadBookDto: UploadBookDto): Promise<Book> {
    uploadBookDto.purchase = new Date(uploadBookDto.purchase);
    const newBook = await this.bookModel.create(uploadBookDto);
    return newBook;
  }

  async findBookById(id: string): Promise<Book> {
    const book = await await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('일치하는 책이 존재하지 않습니다.');
    }
    return book;
  }

  async findBookByIdWithSeller(id: string): Promise<Book> {
    const book = await (await this.bookModel.findById(id)).populated('seller');
    if (!book) {
      throw new NotFoundException('일치하는 책이 존재하지 않습니다.');
    }
    return book;
  }

  async removeBook(userId, bookId) {
    const book = await this.findBookByIdWithSeller(bookId);
    if (userId !== book.seller.id) {
      return {
        success: false,
        message: '삭제 권한이 없습니다.',
      };
    }

    if (userId === book.seller.id) {
      return {
        success: true,
        message: '해당 책이 삭제되었습니다.',
      };
    }
  }
}
