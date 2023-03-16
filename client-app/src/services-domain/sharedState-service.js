

export default class SharedStateService {
    static instance = SharedStateService.instance || new SharedStateService();

    // Shared states,
    currentHotelId = 0;
    hotelWallet = null;

    
}