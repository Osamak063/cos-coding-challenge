import { AggregatedAuction } from "../dtos/AggregatedAuction";

/**
 * This service describes an interface to access auction data from the CarOnSale API.
 */
export interface ICarOnSaleClient {

    getAggregatedAuctions(): Promise<AggregatedAuction>

}
