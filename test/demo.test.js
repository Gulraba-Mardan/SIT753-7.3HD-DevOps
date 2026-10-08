const request = require("supertest");
const { expect } = require("chai");
const { app } = require("../server");
const db = require("./helpers/db");

describe("Campus Lost and Found API", () => {
  before(async () => {
    await db.connect();
  });

  afterEach(async () => {
    await db.clearCollections();
  });

  after(async () => {
    await db.disconnect();
  });

  describe("GET /api/student", () => {
    it("should return student information with status 200", async () => {
      const response = await request(app).get("/api/student");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.property(
        "name",
        "Gulireba-Maierdan"
      );
      expect(response.body).to.have.property(
        "studentId",
        "224414026"
      );
    });

    it("should return JSON content", async () => {
      const response = await request(app).get("/api/student");

      expect(response.headers["content-type"]).to.match(/json/);
    });
  });

  describe("POST /api/items", () => {
    it("should return 400 when required fields are missing", async () => {
      const response = await request(app)
        .post("/api/items")
        .send({
          type: "lost",
          title: "Lost Phone"
        });

      expect(response.status).to.equal(400);
      expect(response.body).to.have.property(
        "message",
        "All required fields must be provided."
      );
    });

    it("should create a new lost item and return status 201", async () => {
      const newItem = {
        type: "lost",
        title: "Black Backpack",
        category: "Bags",
        date: "2026-10-07",
        location: "Deakin University",
        description: "Black backpack lost near the library"
      };

      const response = await request(app)
        .post("/api/items")
        .send(newItem);

      expect(response.status).to.equal(201);
      expect(response.body).to.have.property(
        "message",
        "Report created successfully."
      );
      expect(response.body.item).to.have.property(
        "title",
        "Black Backpack"
      );
      expect(response.body.item).to.have.property(
        "status",
        "active"
      );
      expect(response.body.item).to.have.property("id");
    });
  });
    describe("GET /api/items", () => {
    it("should return items stored in the database", async () => {
      const newItem = {
        type: "found",
        title: "Water Bottle",
        category: "Other",
        date: "2026-10-07",
        location: "Deakin Library",
        description: "Blue water bottle found on a table"
      };

      const createResponse = await request(app)
        .post("/api/items")
        .send(newItem);

      expect(createResponse.status).to.equal(201);

      const response = await request(app).get("/api/items");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array");
      expect(response.body).to.have.lengthOf(1);
      expect(response.body[0]).to.have.property(
        "title",
        "Water Bottle"
      );
      expect(response.body[0]).to.have.property(
        "type",
        "found"
      );
      expect(response.body[0]).to.have.property(
        "status",
        "active"
      );
    });
  });
});