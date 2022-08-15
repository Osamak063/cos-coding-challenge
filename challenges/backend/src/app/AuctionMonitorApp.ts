import { inject, injectable } from "inversify";
import { ILogger } from "./services/Logger/interface/ILogger";
import { DependencyIdentifier } from "./DependencyIdentifiers";
import "reflect-metadata";
import { ICarOnSaleClient } from "./services/CarOnSaleClient/interface/ICarOnSaleClient";
@injectable()
export class AuctionMonitorApp {

    public constructor(
        @inject(DependencyIdentifier.LOGGER) private logger: ILogger,
        @inject(DependencyIdentifier.CAR_ON_SALE_CLIENT) private carOnSaleClient: ICarOnSaleClient) {
    }

    public async start(): Promise<void> {
        this.logger.log(`Auction Monitor started.`);
        try {
            let aggregatedAuctions = await this.carOnSaleClient.getAggregatedAuctions();
            this.logger.log(`Number of Auctions: ${aggregatedAuctions.total}`);
            this.logger.log(`Average Number of Bids on an Auction: ${aggregatedAuctions.avgNumOfBids}`);
            this.logger.log(`Average Percentage of the Auction Progress: ${aggregatedAuctions.avgPercentageOfProgress}`);
        }
        catch (ex) {
            process.exit(-1);
        }
    }

}
