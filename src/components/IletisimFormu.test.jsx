import { afterEach, beforeEach, expect, test } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom"; // Birşeyleri Moc' lamamıza yarıyor . Yani sana sıra geldiğinde şöyle davran diyebilmemizi sağlıyor.
import userEvent from "@testing-library/user-event";
import fs from "fs";
import path from "path";

//eksik import buraya

import IletisimFormu from "./IletisimFormu";

beforeEach(() => {
  render(<IletisimFormu />);
});

// beforeEach hook kullanarak her bir testten önce IletişimFormu render ediyor.

test("[1] hata olmadan render ediliyor", () => {
  render(<IletisimFormu />); // Burada sadece iletişim formu render edilsin isteniyor.
});

test("[2] iletişim formu headerı render ediliyor", () => {
  //get by text ile h1 tagini yakalayın
  //to be in the document, to be truthy, to have text content ile kontrol edin.
  const header = screen.getByText("İletişim Formu");
  expect(header).toBeInTheDocument();
  expect(header).toBeTruthy(); // Truthy: örneğin bir tane header projesini get yaptın. Header projesi undefined ise falsely bir ifadedir. Header
  //  projesi içinde bir değer varsa o bizim için truthy bi fade oluyor.
  expect(header).toHaveTextContent("İletişim Formu");

  // Yukarda getByText, toBeInTheDocument ve toHaveTextContent hespi aynı görevi görüyor sadece bir tane kullansak yeterli olur.
});

test("[3] kullanıcı adını 5 karakterden az girdiğinde BİR hata mesajı render ediyor.", async () => {
  //get by label text ile name alanını yakalayınız
  //find all by test id ile error mesajlarını yakalayın
  //to have length ile kontrol edin.
  const nameInput = screen.getByLabelText("Ad*");
  userEvent.type(nameInput, "123");
  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test("[4] kullanıcı inputları doldurmadığında ÜÇ hata mesajı render ediliyor.", async () => {
  //hiç bir alanı doldurmadan get by role ile butonu yakalayın
  //error mesajlarının to have lengthine bakarak kontrol edin
  const submitButton = screen.getByRole("button");
  userEvent.click(submitButton);
  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages).toHaveLength(3);
});

test("[5] kullanıcı doğru ad ve soyad girdiğinde ama email girmediğinde BİR hata mesajı render ediliyor.", async () => {
  //get by test id ile input alanlarını yakalayın
  //error mesajlarının to have lengthine bakarak kontrol edin
  const nameInput = screen.getByTestId("name-input");
  userEvent.type(nameInput, "Kenan");

  const lastNameInput = screen.getByTestId("lastName-input");
  userEvent.type(lastNameInput, "Turgay");

  const submitButton = screen.getByTestId("submit-button");

  userEvent.click(submitButton);

  const errorMessages = await screen.findAllByTestId("error");
  expect(errorMessages).toHaveLength(1);
});

test('[6] geçersiz bir mail girildiğinde "Hata: email geçerli bir email adresi olmalıdır." hata mesajı render ediliyor', async () => {
  //errorı get by test id ile yakalayın
  //to have text content ile hata metnini kontrol edin
  const emailInput = screen.getByLabelText("E-mail*");
  userEvent.type(emailInput, "kenan");
  const errorMessages = screen.getByTestId("error");

  await waitFor(() => {
    expect(errorMessages).toHaveTextContent(
      "Hata: email geçerli bir email adresi olmalıdır."
    );
  });
});

test('[7] soyad girilmeden gönderilirse "Hata: soyad gereklidir." mesajı render ediliyor', async () => {
  //find by text ve to be in the document ile hata metni ekranda mı kontrol edin

  const submitButton = screen.getByTestId("submit-button");

  userEvent.click(submitButton);

  const errorMessages = await screen.findByText("Hata: soyad gereklidir.");

  expect(errorMessages).toBeInTheDocument();
});

test("[8] ad, soyad, email render ediliyor. mesaj bölümü doldurulmadığında hata mesajı render edilmiyor.", async () => {
  const nameInput = screen.getByTestId("name-input");
  userEvent.type(nameInput, "Kenan");

  const lastNameInput = screen.getByTestId("lastName-input");
  userEvent.type(lastNameInput, "Turgay");

  const emailInput = screen.getByTestId("email-input");
  userEvent.type(emailInput, "kenan@turgayholding.com.tr");

  const submitButton = screen.getByTestId("submit-button");

  userEvent.click(submitButton);

  await waitFor(() => {
    const firstnameDisplay = screen.getByTestId("firstnameDisplay");
    const lastnameDisplay = screen.getByTestId("lastnameDisplay");
    const emailDisplay = screen.getByTestId("emailDisplay");

    expect(firstnameDisplay).toBeInTheDocument();
    expect(lastnameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
  });
});

test("[9] form gönderildiğinde girilen tüm değerler render ediliyor.", async () => {

  const nameInput = screen.getByTestId("name-input");
  userEvent.type(nameInput, "Kenan");

  const lastNameInput = screen.getByTestId("lastName-input");
  userEvent.type(lastNameInput, "Turgay");

  const emailInput = screen.getByTestId("email-input");
  userEvent.type(emailInput, "kenan@turgayholding.com.tr");

  const messageInput = screen.getByTestId("message-input");
  userEvent.type(messageInput, "kenan turgay holding ");



  const submitButton = screen.getByTestId("submit-button");

  userEvent.click(submitButton);

  await waitFor(() => {
    const firstnameDisplay = screen.getByTestId("firstnameDisplay");
    const lastnameDisplay = screen.getByTestId("lastnameDisplay");
    const emailDisplay = screen.getByTestId("emailDisplay");
    const messageDisplay = screen.getByTestId("messageDisplay");

    expect(firstnameDisplay).toBeInTheDocument();
    expect(lastnameDisplay).toBeInTheDocument();
    expect(emailDisplay).toBeInTheDocument();
    expect(messageDisplay).toBeInTheDocument();
  });
  
});

//

//

// BURADAN SONRASINA DOKUNMAYIN //
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const testFile = fs
  .readFileSync(path.resolve(__dirname, "./IletisimFormu.test.jsx"), "utf8")
  .replaceAll(/(?:\\r\\n|\\r|\\n| )/g, "");
const tests = testFile.split("test('[");

test("Kontrol: IletisimFormu componenti import edilmiş.", async () => {
  expect(tests[0]).toContain("importIletisimFormufrom");
});

test("Kontrol: test[1] için render metodu kullanılmış", async () => {
  expect(tests[1]).toContain("render(<IletisimFormu");
});

test("Kontrol: test[2] için screen.getByText(...) kullanılmış", async () => {
  expect(tests[2]).toContain("screen.getByText(");
});

test("Kontrol: test[2] için .toBeInTheDocument() ile kontrol edilmiş", async () => {
  expect(tests[2]).toContain(".toBeInTheDocument()");
});

test("Kontrol: test[2] için .toBeTruthy() ile kontrol edilmiş", async () => {
  expect(tests[2]).toContain(".toBeTruthy()");
});

test("Kontrol: test[2] için .toHaveTextContent(...) ile kontrol edilmiş", async () => {
  expect(tests[2]).toContain(".toHaveTextContent(");
});

test("Kontrol: test[3] için screen.getByLabelText(...) kullanılmış", async () => {
  expect(tests[3]).toContain("screen.getByLabelText(");
});

test("Kontrol: test[3] için screen.findAllByTestId(...) kullanılmış", async () => {
  expect(tests[3]).toContain("screen.findAllByTestId(");
});

test("Kontrol: test[3] için findAllByTestId await ile kullanılmış", async () => {
  expect(tests[3]).toContain("awaitscreen.findAllByTestId");
});

test("Kontrol: test[3] için .toHaveLength(...) ile kontrol edilmiş", async () => {
  expect(tests[3]).toContain(".toHaveLength(1)");
});

test("Kontrol: test[4] için .getByRole(...) kullanılmış ", async () => {
  expect(tests[4]).toContain("screen.getByRole(");
});

test("Kontrol: test[4] için .toHaveLength(...) ile kontrol edilmiş", async () => {
  expect(tests[4]).toContain(".toHaveLength(3)");
});

test("Kontrol: test[5] için .getByTestId(...) kullanılmış", async () => {
  expect(tests[5]).toContain("screen.getByTestId(");
});

test("Kontrol: test[5] için .toHaveLength(...) ile kontrol edilmiş", async () => {
  expect(tests[5]).toContain(".toHaveLength(1)");
});

test("Kontrol: test[6] için .getByTestId(...) kullanılmış", async () => {
  expect(tests[6]).toContain("screen.getByTestId(");
});

test("Kontrol: test[6] için .toHaveTextContent(...) ile kontrol edilmiş", async () => {
  expect(tests[6]).toContain(").toHaveTextContent(");
});

test("Kontrol: test[7] için .findByText(...) await ile kullanılmış", async () => {
  expect(tests[7]).toContain("awaitscreen.findByText(");
});

test("Kontrol: test[7] için .toBeInTheDocument() ile kontrol edilmiş", async () => {
  expect(tests[7]).toContain(").toBeInTheDocument()");
});

test("Kontrol: tüm testlerde(test1 hariç) iletişim formu ayrı ayrı render edilmesi yerine beforeEach hooku kullılarak, render içinde yapılmış.", async () => {
  expect(tests[0]).toContain("beforeEach(()=>{");
  expect(tests[0]).toContain("render(<IletisimFormu/>)");
});
