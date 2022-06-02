import { sendHttpRequest, BASE_URL } from "../../services/network";

function fetchData(email, password) {
  return sendHttpRequest(
    "POST",
    BASE_URL + "/login",
    null,
    JSON.stringify({
      email: email,
      password: password,
    })
  ).then((res) => {
    let loginStatus = "";

    if (res.data && res.data["exists"] === false) {
      loginStatus = "failed";
    } else {
      loginStatus = "passed";
    }
    return loginStatus;
  });
}

test("Test unsuccessful user authentication", async () => {
  await expect(fetchData("Wrong@User.com", "1234")).resolves.toBe("failed");
});

test("Test successful user authentication", async () => {
  await expect(fetchData("STUD001@STUD001.com", "1234")).resolves.toBe(
    "passed"
  );
});

function createPanel(name) {
  return sendHttpRequest(
    "POST",
    BASE_URL + "/createPanel",
    null,
    JSON.stringify({
      name: name,
    })
  ).then(async (res) => {
    const panelArray = await fetchPanel();
    return panelArray.some((val) => val === name) ? "created" : "failed";
  });
}

function fetchPanel() {
  return sendHttpRequest("GET", BASE_URL + "/panels").then((res) => {
    return res.data;
  });
}

test("Unsuccessful panel creation", async () => {
  await expect(createPanel("Panel0001")).resolves.toBe("failed");
});
