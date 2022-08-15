# Backend Challenge

## Getting Started

Clone the code from the repository and follow the below given instructions.

### Git Branch

Please checkout and pull from branch osama/backend-cos-coding-challenge/development.

### Installation & Setup

Install dependencies and node_modules by running the command:

```
npm install
```

### Running

Before running, make sure to create `.env` file in the directory
`\cos-coding-challenge\challenges\backend\.env`
Copy all environment variables from
`\cos-coding-challenge\challenges\backend\envs\development.env`
And paste it into the newly created .env file.

.env file often includes sensitive and confidential information. Following the best practices of development, it is part of .gitignore. For a quick start, I have added the correct values of environment variables in
`\cos-coding-challenge\challenges\backend\envs\development.env` file.

Run command:

```
npm start
```

The application will display the desired output in the console and if the CarOnSale API is failing, the process
will be quit with exit code -1.

### Testing

```
npm test
```

## Project Structure

- `src/app/interceptors/CarOnSaleAPIInterceptor.ts`: Intercepts requests and responses of CarOnSale API before they are handled by then or catch. It has exported AxiosInstance with basic configuration and some basic validation in request and response interceptors.
- `src/app/repositories/CarOnSaleRepo/classes/CarOnSaleRepo.ts`: CarOnSaleRepo class is responsible for creating HTTP requests to CarOnSale API using AxiosInstance and returning the responses in DTOs. With CarOnSaleRepo the responses from CarOnSale API can be stubbed in unit tests.
- `src/app/services/CarOnSaleRepo/dtos/AuthenticationResponse.ts`: AuthenticationResponse is a DTO (Data Transfer Object) that carries data between Axios response and CarOnSaleRepo. Contains authToken and userId from Authentication endpoint response.
- `src/app/services/CarOnSaleRepo/dtos/RunningAuctionsList.ts`: RunningAuctionsList is a DTO (Data Transfer Object) that carries data between Axios response and CarOnSaleRepo. Contains fields that are used in the calculation of aggregated auctions result from the Running Auctions List endpoint response.
- `src/app/services/CarOnSaleClient/classes/CarOnSaleClient.ts`: CarOnSaleClient class is responsible for calculating Aggregated Auction result (Business logic) and returning the result in DTOs. Unit tests are written for testing the business logic of this class.
- `src/app/services/CarOnSaleClient/dtos/AggregatedAuction.ts`: AggregatedAuction is a DTO (Data Transfer Object) that carries data between AuctionMonitorApp and CarOnSaleClient. Contains AggregatedAuction result.
- `src/app/services/Logger/classes/Logger.ts`: The logger class is responsible for logging data in the console.
- `src/app/util/MathUtil.ts`: MathUtil is a utility for some basic calculations which adds reusability to code.
- `src/test/services/CarOnSaleClient.spec.ts`: CarOnSaleClient.spec.ts contains unit tests for CarOnSaleClient with CarOnSaleRepo stubs for testing.

## Limitations/Known Improvements

- There is no saving mechanism of authToken in this app right now. For improvement we can save/cache the authToken in the first call to authentication endpoint and use that token for subsequent requests without calling authentication endpoint everytime. Only call authentication endpoint when authToken expires.
- We can use secrets management tools like HashiCorp vault or AWS Secret manager to control access to sensitive
  credentials like Email and passsword of CarOnSale API.
- Running list of auctions API returns page and total fields in the response. Pagination is not yet implemented in this application because of unclear documentation about pagination parameters in this API in swagger. Documentation of this API only defines filter and count query params which are not related to pagination.
- Filter out the Running list of auctions with null/zero values of minimumRequiredAsk in response Axios interceptor instead of the CarOnSaleClient service.

## Authors

- Osama Khalid
