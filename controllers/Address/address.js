import logger from '../../logCreator/log.js';

export class AddressController {
    constructor(addressModel) {
        this.addressesModel = addressModel;
    }

    addAddressToUser = async (req, res) => {
        const { userId } = req.params;
        const addressData = req.body;
        try {
            const newAddress = await this.addressesModel.addAddressToUser({...addressData, userId});
            logger.info('A new address has been created');
            return res.status(201).json({ info: newAddress });
        } catch (error) {
            console.error('Error adding address to user:', error);
            return res.status(500).json({ error: `Server error: the address could not be added. Error message: ${error}` });
        }
    }

    getAddressById = async (req, res) => {
        const { addressId } = req.params;
        try {
            const address = await this.addressesModel.getAddressById(addressId);
            if (!address) {
                logger.warn(`Address ${addressId} not found`);
                return res.status(404).json({ error: 'Address not found' });
            }

            logger.info(`Address ${addressId} found`);
            return res.status(200).json(address);
        } catch (error) {
            console.error('Error getting address by ID:', error);
            return res.status(500).json({ error: `Server error: the address could not be obtained. Error message: ${error}` });
        }
    }

    updateAddressById = async (req, res) => {
        const { addressId } = req.params;
        const updatedAddress = req.body;
        try {
            const updatedAddress = await this.addressesModel.updateAddressById(addressId, updatedAddress);
            if (updatedAddress) {
                logger.info(`Address ${addressId} updated successfully`);
                return res.status(200).json(updatedAddress);
            }
            logger.warn(`Address ${addressId} not updated`);
            return res.status(404).json({ error: 'Address not found' });
        } catch (error) {
            console.error('Error updating address by ID:', error);
            return res.status(500).json({ error: `Server error: the address could not be updated. Error message: ${error}` });
        }
    }

    deleteAddressById = async (req, res) => {
        const { addressId } = req.params;
        try {
            const deletedAddress = await this.addressesModel.deleteAddressById(addressId);
            if (deletedAddress) {
                logger.info(`Address ${addressId} deleted successfully`);
                return res.status(204).json({ message: 'Address deleted successfully' });
            }
            logger.warn(`Address ${addressId} not deleted`);
            return res.status(404).json({ error: 'Address not found' });
        }
        catch (error) {
            console.error('Error deleting address by ID:', error);
            return res.status(500).json({ error: `Server error: the address could not be deleted. Error message: ${error}` });
        }
    }

    getAddressesByUserId = async (req, res) => {
        const { userId } = req.params;
        try {
            const addresses = await this.addressesModel.getAddressesByUserId(userId);
            if (!addresses) {
                logger.warn(`Addresses not found for user ${userId}`);
                return res.status(404).json({ error: 'Addresses not found' });
            }
            logger.info(`Addresses found for user ${userId}`);
            return res.status(200).json(addresses);
        } catch (error) {
            console.error('Error getting addresses by user ID:', error);
            return res.status(500).json({ error: `Server error: the addresses could not be obtained. Error message: ${error}` });
        }
    }   
}