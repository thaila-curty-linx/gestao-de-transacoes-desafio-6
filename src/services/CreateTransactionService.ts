import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    if (!['income', 'outcome'].includes(type)) {
      throw new AppError('Transaction type is invalid');
    }
    const { total } = await transactionsRepository.getBalance();
    if (type === 'outcome' && total < value) {
      throw new AppError("You don't have enough balance");
    }

    const CategoryRepository = getRepository(Category);

    let categoryTransaction = await CategoryRepository.findOne({
      title: category,
    });

    if (!categoryTransaction) {
      categoryTransaction = await CategoryRepository.create({
        title: category,
      });
      await CategoryRepository.save(categoryTransaction);
    }

    const transation = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryTransaction,
    });

    await transactionsRepository.save(transation);

    return transation;
  }
}

export default CreateTransactionService;
