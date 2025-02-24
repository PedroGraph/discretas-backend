import { Router } from 'express';
import { AddressController } from '../controllers/Address/address.js';
import { validateCreateAddress, validateUpdateAddress } from '../middlewares/validateAddress.js';

export const creatingAddress = ({ addressModel }) => {

    const addressRouter = Router();
    const addressController = new AddressController(addressModel);
    const { addAddressToUser, getAddressesByUserId, getAddressById, updateAddressById, deleteAddressById } = addressController;

    addressRouter.post('/users/:userId', validateCreateAddress, addAddressToUser);
    addressRouter.get('/users/:userId', getAddressesByUserId);
    addressRouter.get('/:addressId', getAddressById);
    addressRouter.put('/:addressId', validateUpdateAddress, updateAddressById);
    addressRouter.delete('/:addressId', deleteAddressById);

    return addressRouter;
}