import { Router } from 'express';
import authMiddleware from '../controllers/Middleware/middleware.js';
import { AddressController } from '../controllers/Address/address.js';

export const creatingAddress = ({ addressModel }) => {

    const addressRouter = Router();
    const addressController = new AddressController(addressModel);
    const { addAddressToUser, getAddressesByUserId, getAddressById, updateAddressById, deleteAddressById } = addressController;

    addressRouter.post('/users/:userId', addAddressToUser);
    addressRouter.get('/users/:userId', getAddressesByUserId);
    addressRouter.get('/:addressId', getAddressById);
    addressRouter.put('/:addressId', updateAddressById);
    addressRouter.delete('/:addressId', deleteAddressById);

    return addressRouter;
}