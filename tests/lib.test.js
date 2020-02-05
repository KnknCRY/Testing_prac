const lib = require("../lib");
const db = require("../db");
const mail = require("../mail");

describe("absolute", () => {
  it("should return a positive number if input is positive", () => {
    const result = lib.absolute(1);
    expect(result).toBe(1);
  });

  it("should return a positive number if input is negtive", () => {
    const result = lib.absolute(-1);
    expect(result).toBe(1);
  });

  it("should return a 0 number if input is 0", () => {
    const result = lib.absolute(0);
    expect(result).toBe(0);
  });
});

describe("greet", () => {
  it("should return the greeting message", () => {
    const result = lib.greet("Jason");
    expect(result).toMatch(/Jason/);
    expect(result).toContain("Jason");
  });
});

describe("getCurrencies", () => {
  it("should return supported currencies", () => {
    const result = lib.getCurrencies();

    expect(result).toContain("USD");
    expect(result).toContain("AUD");
    expect(result).toContain("EUR");

    expect(result).toEqual(expect.arrayContaining(["AUD", "EUR", "USD"]));
  });
});

describe("getProduct", () => {
  it("should return the product with the given id", () => {
    const result = lib.getProduct(1);
    //不能用toBe，因為它是看記憶體位置
    //expect(result).toEqual({ id: 1, price: 10 }); //左右要完全一樣
    expect(result).toMatchObject({ id: 1, price: 10 }); //右邊包含於左邊就會過
    expect(result).toHaveProperty("id", 1);
  });
});

describe("registerUser", () => {
  it("should throw if username is falsy", () => {
    const args = [null, undefined, NaN, "", 0, false];
    args.forEach(a => {
      expect(() => {
        lib.registerUser(a);
      }).toThrow();
    });
  });

  it("should return a user object if valid username is passed", () => {
    const result = lib.registerUser("Jason");
    expect(result).toMatchObject({ username: "Jason" });
    expect(result.id).toBeGreaterThan(0);
  });
});

describe("applyDiscount", () => {
  it("should apply 10% discount if customer has more than 10 points", () => {
    db.getCustomerSync = function(customerId) {
      console.log("fake reading...");
      return { id: customerId, points: 20 };
    };
    //如果加上這些，getCustomerSync會直接被這邊的code取代
    //目的是在測試的時候我不想要真的去db取得資料
    const order = { customerId: 1, totalPrice: 10 };
    lib.applyDiscount(order); //把order pass進去function直接更改order的數值
    expect(order.totalPrice).toBe(9);
  });
});

describe("notifyCustomer", () => {
  it("should send an e-mail to the customer", () => {
    // db.getCustomerSync = function(customerId) {
    //   return { email: "a" };
    // };

    // let mailSent = false;
    // mail.send = function(email, msg) {
    //   mailSent = true;
    // };

    //lib.notifyCustomer({ customerId: 1 });

    // expect(mailSent).toBe(true);

    //-------------------------------------------
    /*const mockFunction = jest.fn();
    mockFunction.mockReturnValue(1);
    mockFunction.mockResolvedValue(1);
    mockFunction.mockRejectValue(new Error('some err...'))
    const result = mockFunction();*/
    //-------------------------------------------
    db.getCustomerSync = jest.fn().mockReturnValue({ email: "a" });
    mail.send = jest.fn();
    lib.notifyCustomer({ customerId: 1 });
    expect(mail.send).toHaveBeenCalled();

    // mail.send.mock.calls[0] is an array of function arguments
    expect(mail.send.mock.calls[0][0]).toBe("a"); // mail.send的第一個參數
    expect(mail.send.mock.calls[0][1]).toMatch(/order/); // mail.send的第一個參數
  });
});
