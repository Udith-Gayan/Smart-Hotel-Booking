const sqlite3 = require('sqlite3').verbose();
const settings = require('../settings.json').settings;
const fs = require('fs')


// //create the database if does not exists
// let db = new sqlite3.Database(settings.dbPath);

export class DbService {

    static #db = null;

    static async initializeDatabase() {

        if (this.#db == null && !fs.existsSync(settings.dbPath)) {
            this.#db = new sqlite3.Database(settings.dbPath);

            // Hotel Table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Hotels (
                    Id INTEGER,
                    HotelWalletAddress TEXT NOT NULL UNIQUE,
                    HotelNftId TEXT NOT NULL UNIQUE,
                    OwnerName TEXT,
                    Name TEXT,
                    AddressLine1 TEXT,
                    AddressLine2 TEXT,
                    DistanceFromCenter FLOAT,
                    Email TEXT,
                    ContactNumber1 TEXT,
                    ContactNumber2 TEXT,
                    IsRegistered INTEGER DEFAULT 0,

                    PRIMARY KEY("Id" AUTOINCREMENT)
                    )`);

            // Image Table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Images (
                Id INTEGER,
                Url TEXT,
                HotelId INTEGER,
                PRIMARY KEY("Id" AUTOINCREMENT),
                FOREIGN KEY (HotelId) REFERENCES Hotels (Id)
            )`);

            // Hotel Facility attributes Table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS HFacilities (
                Id INTEGER,
                Name TEXT,
                Description TEXT,
                Status TEXT,
                PRIMARY KEY("Id" AUTOINCREMENT)
            )`);

            // Hotel - Hotel Facility Attribute Tables (M2M)
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS HotelHFacilities (
                HotelId INTEGER,
                HFacilityId INTEGER,
                PRIMARY KEY("HotelId", "HFacilityId"),
                FOREIGN KEY (HotelId) REFERENCES Hotels (Id),
                FOREIGN KEY (HFacilityId) REFERENCES HFacilities (Id)
            )`);
  
            // Room table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Rooms (
                        Id INTEGER,
                        Name TEXT NOT NULL,
                        Description TEXT,
                        MaxRoomCount Integer,
                        CostPerNight DOUBLE,
                        NoOfBeds Integer,
                        HotelId INTEGER,
                        PRIMARY KEY("Id" AUTOINCREMENT),
                        FOREIGN KEY (HotelId) REFERENCES Hotels (Id)
                        )`);
            
            // Facilities of a room table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS RFacilities (
                Id INTEGER,
                Name TEXT NOT NULL,
                Description TEXT,
                Status TEXT,
                PRIMARY KEY("Id" AUTOINCREMENT)
                )`);


            // Room-Facilities Table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS RoomFacilities (
                RoomId INTEGER,
                RFacilityId INTEGER,
                Quantity INTEGER,
                PRIMARY KEY("RoomId", "RFacilityId"),
                FOREIGN KEY (RoomId) REFERENCES Rooms (Id),
                FOREIGN KEY (RFacilityId) REFERENCES RFacilities (Id)
                )`);

            // Customer table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Customers (
                Id INTEGER,
                Name TEXT,
                Email Text,
                ContactNumber TEXT,
                PRIMARY KEY("Id" AUTOINCREMENT)
            )`);

            // Reservations table
            await this.#runQuery(`CREATE TABLE IF NOT EXISTS Reservations (
                Id INTEGER,
                RoomId INTEGER,
                RoomCount INTEGER,
                CustomerId INTEGER,
                FromDate DATE,
                ToDate DATE,
                Cost DOUBLE,
                PRIMARY KEY("Id" AUTOINCREMENT),
                FOREIGN KEY (CustomerId) REFERENCES Customers (Id),
                FOREIGN KEY (RoomId) REFERENCES Rooms (Id)
                )`)

            // await this.#insertData();

            console.log("Database initialized.");
            this.#db.close();
        }
    }

    static async #insertData() {

        // Inserting hotels
        let hotels = `INSERT INTO Hotels(Id, HotelWalletAddress, HotelNftId, Name, Address, Email, IsRegistered) VALUES 
                        (1, "rpnzMDvKfN1ewJs4ddSRXFFZQF6Ubmhkqx", "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65", "Hotel Mandara Rosen", "Kataragama", "test1@gmail.com", 1),
                        (2, "rfKk9cRbspDzo62rbWniTMQX93FfCt8w5o", "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D66", "Hotel Hilton", "Colombo 1", "hilton.lk@gmail.com", 1),
                        (3, "rLkLngcLBKfiYRL32Ygk4WYofBudgii3zk", "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D67", "Hotel Galadari", "Colombo 1", "galadari@gmail.com", 1)`;

        await this.#runQuery(hotels);

        // Inserting Rooms
        let rooms = `INSERT INTO Rooms(Id, HotelId, RoomNftId, Name) VALUES
                        (1, 1, "000B013A95F14B0044F78A264E41713C64B5F8924254055E208C3098E00000D65", "Sea-View Room"),
                        (2, 1, "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D33", "Coconut-Grove Room"),
                        (3, 1, "000B013A95F14B0044F78A264E41713C64B5F89242540EEDD08C3098E00000D65", "Presidential Room"),
                        (4, 2, "000B013A95F14B0044F78A264E41713C64B5F89242540EE20866098E00000D65", "Presidential Room"),
                        (5, 2, "000B013A95F14B0044F78A264E41713C64B5F89242540EE208CFEWF98E00000D65", "Beach-View Room"),
                        (6, 2, "000B013A95F14B0044F78A264E41713C64B5F89242540EE208VDFV98E00000D65", "Ever-Green Room"),
                        (7, 2, "000B013A95F14B0044F78A264E41713C64B5F89242540EE208CVD098E00000D65", "Double Bed Room"),
                        (14, 1, "000B013A95F14B0044F78A264E41713C64B5F89242540VDFDFDFF098E00000D65", "Tripple Bed Room"),
                        (8, 1, "000B013A95F14B0044F78A264E41713C64B5F892425SDDSFDFDC3098E00000D65", "Single Bed Room"),
                        (9, 1, "000B013A95F14B0044F78A264E41713C64B5F89242SDCVDSSDVC3098E00000D65", "Single Bed Green View Room"),
                        (10, 1, "000B013A95F14B0044F78A264E41713C64B5F89242540EE208C3098E00000D65", "Non-AC Room"),
                        (11, 3, "000B013A95F14B0044F78A264E41713C64B5F89242540EEFVDV3098E00000D65", "Presidential Room"),
                        (12, 3, "000B013A95F14B0044F78A264E41713C64B5F892425VDFVFVDF3098E00000D65", "Single Bed Room"),
                        (13, 2, "000B013A95F14B0044F78A264E41713C64B5F89242540EE208D3098E00000D65", "Sea-View Blue Room")`;
        await this.#runQuery(rooms);

        // Inserting Bookings
        let bookings = `INSERT INTO Bookings(Id, RoomId, PersonName, UserPubkey, FromDate, ToDate) VALUES
                            (1, 1, "Andrew", "000B013A95F14B0044F78A264E41713C64B5F89242540EE208", "2022-8-10", "2022-8-15"),
                            (2, 1, "Ravi", "000B013A95F14B0044F78A264E41713C64B5F89242540EE210", "2022-9-3", "2022-9-10"),
                            (3, 5, "Perera", "000B013A95F14B0044F78A264E41713C64B5F89242540EE209",  "2022-8-31", "2022-9-2")`;
        await this.#runQuery(bookings);
    }

    static #runQuery(query, params = null) {
        return new Promise((resolve, reject) => {
            this.#db.run(query, params ? params : [], function (err) {
                if (err) {
                    reject(err);
                    return;
                }

                resolve({ lastId: this.lastID, changes: this.changes });
            });
        });
    }


}