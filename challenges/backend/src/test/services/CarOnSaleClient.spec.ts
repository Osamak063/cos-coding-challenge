import "reflect-metadata";
import { expect } from "chai";
import { Container } from "inversify";
import sinon from "sinon";
import { DependencyIdentifier } from "../../app/DependencyIdentifiers";
import { CarOnSaleClient } from "../../app/services/CarOnSaleClient/classes/CarOnSaleClient";
import { ICarOnSaleClient } from "../../app/services/CarOnSaleClient/interface/ICarOnSaleClient";
import axios, { AxiosInstance } from "axios";
import { ICarOnSaleRepo } from "../../app/repositories/CarOnSaleRepo/interface/ICarOnSaleRepo";
import { CarOnSaleRepo } from "../../app/repositories/CarOnSaleRepo/classes/CarOnSaleRepo";
import { AuctionItem, RunningAuctionList } from "../../app/repositories/CarOnSaleRepo/dtos/RunningAuctionsList";


describe("App", function () {
    const container = new Container({
        defaultScope: "Singleton",
    });

    let repo: ICarOnSaleRepo;
    this.beforeAll(() => {
        container.bind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
        container.bind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO).to(CarOnSaleRepo);
        container.bind<AxiosInstance>(DependencyIdentifier.AXIOS_INSTANCE)
            .toConstantValue(axios.create());
    });


    beforeEach(() => {
        repo = new CarOnSaleRepo(container.get<AxiosInstance>(DependencyIdentifier.AXIOS_INSTANCE));
    });

    afterEach(function () {

    });

    it("Should return correct number of auctions", async function () {
        //Arrange        
        const stubItems: AuctionItem[] = [{
            id: 1,
            label: "Action1",
            currentHighestBidValue: 1000,
            minimumRequiredAsk: 200,
            numBids: 1
        }]

        const stubValue: RunningAuctionList = {
            items: stubItems,
            page: 1,
            total: 1
        }

        //const repo = sinon.createStubInstance<ICarOnSaleRepo>(CarOnSaleRepo);
        sinon.stub(repo, "getListOfRunningAuctions").returns(new Promise((resolve) => {
            resolve(stubValue);
        }));
        container.rebind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO)
            .toConstantValue(repo);
        container.rebind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
        // Act
        const service = container.get<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT);
        const total = (await service.getAggregatedAuctions())?.total
        // Assert
        expect(total).to.equal(1);
    });


    it("Should return correct value of average number of bids on an auction", async function () {
        //Arrange        
        const stubItems: AuctionItem[] = [{
            id: 1,
            label: "Action1",
            currentHighestBidValue: 1000,
            minimumRequiredAsk: 200,
            numBids: 1
        },
        {
            id: 2,
            label: "Action2",
            currentHighestBidValue: 1000,
            minimumRequiredAsk: 200,
            numBids: 5
        }]

        const stubValue: RunningAuctionList = {
            items: stubItems,
            page: 1,
            total: 1
        }

        sinon.stub(repo, "getListOfRunningAuctions").returns(new Promise((resolve) => {
            resolve(stubValue);
        }));
        container.rebind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO)
            .toConstantValue(repo);
        container.rebind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
        // Act
        const service = container.get<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT);
        const avgNumOfBids = (await service.getAggregatedAuctions())?.avgNumOfBids
        // Assert
        expect(avgNumOfBids).to.equal(3);
    });

    it("Should return correct value of average percentage of the auction progress", async function () {
        //Arrange        
        const stubItems: AuctionItem[] = [{
            id: 1,
            label: "Action1",
            currentHighestBidValue: 114,
            minimumRequiredAsk: 6354,
            numBids: 1
        },
        {
            id: 2,
            label: "Action2",
            currentHighestBidValue: 191,
            minimumRequiredAsk: 6763,
            numBids: 5
        }]

        const stubValue: RunningAuctionList = {
            items: stubItems,
            page: 1,
            total: 1
        }

        sinon.stub(repo, "getListOfRunningAuctions").returns(new Promise((resolve) => {
            resolve(stubValue);
        }));
        container.rebind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO)
            .toConstantValue(repo);
        container.rebind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
        // Act
        const service = container.get<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT);
        const avgPercentageOfProgress = (await service.getAggregatedAuctions())?.avgPercentageOfProgress;
        // Assert
        expect(avgPercentageOfProgress).to.equal(2.3091);
    });


    it("Should return zero value of average percentage of the auction progress in case of minimumRequiredAsk is null/zero", async function () {
        //Arrange        
        const stubItems: AuctionItem[] = [{
            id: 1,
            label: "Action1",
            currentHighestBidValue: 114,
            minimumRequiredAsk: 0,
            numBids: 1
        }]

        const stubValue: RunningAuctionList = {
            items: stubItems,
            page: 1,
            total: 1
        }

        sinon.stub(repo, "getListOfRunningAuctions").returns(new Promise((resolve) => {
            resolve(stubValue);
        }));
        container.rebind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO)
            .toConstantValue(repo);
        container.rebind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
        // Act
        const service = container.get<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT);
        const avgPercentageOfProgress = (await service.getAggregatedAuctions())?.avgPercentageOfProgress;
        // Assert
        expect(avgPercentageOfProgress).to.equal(0);
    });


    it("Should filter out auctions where minimumRequiredAsk is null/zero and calculate only the value of average percentage of the auction progress in case of minimumRequiredAsk is not null/zero", async function () {
        //Arrange        
        const stubItems: AuctionItem[] = [{
            id: 1,
            label: "Action1",
            currentHighestBidValue: 114,
            minimumRequiredAsk: 0,
            numBids: 1
        },
        {
            id: 2,
            label: "Action2",
            currentHighestBidValue: 191,
            minimumRequiredAsk: 6763,
            numBids: 5
        }]

        const stubValue: RunningAuctionList = {
            items: stubItems,
            page: 1,
            total: 1
        }

        sinon.stub(repo, "getListOfRunningAuctions").returns(new Promise((resolve) => {
            resolve(stubValue);
        }));
        container.rebind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO)
            .toConstantValue(repo);
        container.rebind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
        // Act
        const service = container.get<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT);
        const avgPercentageOfProgress = (await service.getAggregatedAuctions())?.avgPercentageOfProgress;
        // Assert
        expect(avgPercentageOfProgress).to.equal(2.8241);
    });

    it("Should return zero for all values of aggregated auction in case of empty response list.", async function () {
        //Arrange        
        const stubItems: AuctionItem[] = []

        const stubValue: RunningAuctionList = {
            items: stubItems,
            page: 1,
            total: 0
        }

        sinon.stub(repo, "getListOfRunningAuctions").returns(new Promise((resolve) => {
            resolve(stubValue);
        }));
        container.rebind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO)
            .toConstantValue(repo);
        container.rebind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
        // Act
        const service = container.get<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT);
        const aggregatedAuction = (await service.getAggregatedAuctions());
        // Assert
        // Assert
        expect(aggregatedAuction.total).to.equal(0);
        expect(aggregatedAuction.avgNumOfBids).to.equal(0);
        expect(aggregatedAuction.avgPercentageOfProgress).to.equal(0);
    });

    it("Should return zero for all values of aggregated auction in case of undefined response.", async function () {
        //Arrange   
        let stubValue: RunningAuctionList;

        sinon.stub(repo, "getListOfRunningAuctions").returns(new Promise((resolve) => {
            resolve(stubValue);
        }));
        container.rebind<ICarOnSaleRepo>(DependencyIdentifier.CAR_ON_SALE_REPO)
            .toConstantValue(repo);
        container.rebind<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT).to(CarOnSaleClient);
        // Act
        const service = container.get<ICarOnSaleClient>(DependencyIdentifier.CAR_ON_SALE_CLIENT);
        const aggregatedAuction = (await service.getAggregatedAuctions());
        // Assert
        expect(aggregatedAuction.total).to.equal(0);
        expect(aggregatedAuction.avgNumOfBids).to.equal(0);
        expect(aggregatedAuction.avgPercentageOfProgress).to.equal(0);
    });
});
