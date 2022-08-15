import { RunningAuctionList } from "../dtos/RunningAuctionsList";


/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleRepo {

    getListOfRunningAuctions(): Promise<RunningAuctionList>;

}
