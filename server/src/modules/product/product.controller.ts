import { AppError, catchAsync } from '@/utils';
import { sendResponse } from '@/utils/send-response';
import { Query } from './product.interface';
import * as productServices from './product.service';

export const addProduct = catchAsync(async (req, res) => {
  const { userId } = req.jwtPayload;

  const data = await productServices.add(req.body, userId);

  sendResponse(res, {
    status: 201,
    message: 'Product added successfully',
    data,
  });
});

export const getProducts = catchAsync(async (req, res) => {
  const queries = req.query as Query;

  const data = await productServices.get(queries, req.jwtPayload);

  sendResponse(res, {
    message: 'Product successfully retrieved',
    data,
  });
});

export const getProductById = catchAsync(async (req, res) => {
  const productId = req.params.productId as string;

  const data = await productServices.getById(productId, req.jwtPayload);

  if (!data) throw new AppError(404, 'Product not found.');

  sendResponse(res, {
    message: 'Product retrieved successfully',
    data,
  });
});

export const updateProduct = catchAsync(async (req, res) => {
  const productId = req.params.productId as string;

  const data = await productServices.update(req.jwtPayload, productId ,req.body);

  if (!data) throw new AppError(404, 'Product not found.');

  sendResponse(res, {
    status: 200,
    message: 'Product updated successfully',
    data,
  });
});

export const deleteProduct = catchAsync(async (req, res) => {
  const productId = req.params.productId as string;

  await productServices.remove(productId, req.jwtPayload);

  sendResponse(res, {
    status: 200,
    message: 'Product deleted successfully',
    data: null,
  });
});

export const bulkDeleteProducts = catchAsync(async (req, res) => {
  const { count } = await productServices.bulkDelete(req.body, req.jwtPayload);

  sendResponse(res, {
    status: 200,
    message: `${count} products were deleted successfully!`,
  });
});
