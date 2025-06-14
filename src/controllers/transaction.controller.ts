import { Request, Response } from 'express';
import { TransactionModel } from '../models/transaction.model';
import { UserModel } from '../models/user.model';
import { ITransaction } from '../interfaces/transaction.interface';
import { getTransactionsQuerySchema } from '../zod/transaction.schema';

export const createTransaction = async (req: Request, res: Response) => {
  try {
    const userId = req?.user?._id;
    const { source, source_detail } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if ("Bank Account" === source) {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      const allowedList =  user.bankAccounts;
      if (!source_detail || !allowedList.includes(source_detail)) {
        res.status(400).json({
          message: `Invalid bank account selected`,
        });
        return;
      }
    }

    const transaction = await TransactionModel.create({
      ...req.body,
      user: userId,
    });

    res.status(201).json(transaction);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Failed to create transaction', error });
    return;
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const result = getTransactionsQuerySchema.safeParse(req.query);
    if (!result.success) {
      res.status(400).json({ message: 'Invalid query parameters', errors: result.error.format() });
      return;
    }

    const { page, limit, category_type, sortBy, order, fromDate, toDate } = result.data;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    const filter: Record<string, any> = {
      user: req.user._id, // assuming you're using auth middleware
    };

    if (category_type) {
      filter.category_type = category_type;
    }

    if (fromDate || toDate) {
      filter.transaction_date = {};
      if (fromDate) filter.transaction_date.$gte = new Date(fromDate);
      if (toDate) filter.transaction_date.$lte = new Date(toDate);
    }

    const sortOption: { [key: string]: 1 | -1 } = {
      [sortBy]: order === 'asc' ? 1 : -1,
    };

    const transactions = await TransactionModel.find(filter)
      .sort(sortOption)
      .skip(skip)
      .limit(limitNum)
      .exec();

    const total = await TransactionModel.countDocuments(filter);

    res.status(200).json({
      data: transactions,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
      },
    });
    return;
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
    return;
  }
};

// export const getTransactions = async (req: Request, res: Response) => {
//   try {
//     const transactions = await TransactionModel.find({ user: req?.user?._id }).sort({ transaction_date: -1 });
//     res.status(200).json(transactions);
//     return;
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to fetch transactions', error });
//     return;
//   }
// };

export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existing = await TransactionModel.findOne({
      _id: id,
      user: req?.user?._id
    });

    if (!existing) {
      res.status(404).json({ message: 'Transaction not found' });
      return;
    }

    const forbiddenFields: (keyof ITransaction)[] = [
      'amount',
      'category_id',
      'source',
      'source_detail',
      'transaction_date'
    ];

    for (const field of forbiddenFields) {
      if (!(field in req.body)) continue;

      const reqValue = req.body[field];
      const existingValue = existing[field];

      let areEqual = false;

      if (field === 'transaction_date') {
        const reqDate = new Date(reqValue).toISOString().split('T')[0];
        const existingDate = new Date(existingValue as Date).toISOString().split('T')[0];
        areEqual = reqDate === existingDate;
      } else {
        areEqual = String(reqValue) === String(existingValue);
      }

      if (!areEqual) {
        res.status(400).json({
          message: `Modification of '${field}' is not allowed.`,
          help: `For example, if a ₹${existing.amount} ${existing.category_type} was wrongly added, you'd create a reversal.`
        });
        return;
      }
    }

    const updatableFields: (keyof ITransaction)[] = [
      'description',
      'payment_app',
      'status'
    ];

    const updateData: Partial<ITransaction> = {};
    for (const field of updatableFields) {
      if (field in req.body) {
        updateData[field] = req.body[field];
      }
    }

    const updated = await TransactionModel.findOneAndUpdate(
      { _id: id, user: req?.user?._id },
      updateData,
      { new: true }
    );

    res.status(200).json(updated);
    return;
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({
      message: 'Failed to update transaction',
      error
    });
    return;
  }
};


// export const deleteTransaction = async (req: Request, res: Response) => {
//   try {
//     const { id } = req.params;
//     const deleted = await TransactionModel.findOneAndDelete({ _id: id, user: req?.user?._id });
//     if (!deleted) {
//       res.status(404).json({ message: 'Transaction not found' });
//       return;
//     }
//     res.status(200).json({ message: 'Transaction deleted successfully' });
//     return;
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete transaction', error });
//     return;
//   }
// };
