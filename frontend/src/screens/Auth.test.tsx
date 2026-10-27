import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Auth from "./Auth";

function jsonResponse(status: number, body: unknown) {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response);
}

function renderAuth() {
  return render(
    <MemoryRouter initialEntries={["/auth"]}>
      <Auth />
    </MemoryRouter>,
  );
}

async function fillAndSubmit(
  user: ReturnType<typeof userEvent.setup>,
  email: string,
  password: string,
  submitName: "Sign in" | "Create account" = "Sign in",
) {
  await user.type(screen.getByLabelText(/email/i), email);
  await user.type(screen.getByLabelText(/password/i), password);
  await user.click(screen.getByRole("button", { name: new RegExp(`^${submitName}$`) }));
}

describe("Auth screen", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("[AC-001] posts to /auth/signup with credentials included and navigates to the dashboard on success", async () => {
    fetchMock.mockReturnValueOnce(jsonResponse(200, { user_id: "u1", email: "new@example.com" }));
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("tab", { name: "Create account" }));
    await fillAndSubmit(user, "new@example.com", "a-strong-password1", "Create account");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/auth/signup");
    expect(init.credentials).toBe("include");
    expect(JSON.parse(init.body)).toEqual({
      email: "new@example.com",
      password: "a-strong-password1",
    });

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/account created/i));
  });

  it("[AC-002] shows an inline already-registered error on a 409 from signup and stays on the form", async () => {
    fetchMock.mockReturnValueOnce(
      jsonResponse(409, { detail: "dup@example.com is already registered" }),
    );
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("tab", { name: "Create account" }));
    await fillAndSubmit(user, "dup@example.com", "a-strong-password1", "Create account");

    expect(
      await screen.findByText(/dup@example\.com is already registered\./i),
    ).toBeInTheDocument();
    expect(screen.getByRole("tabpanel")).toBeInTheDocument();
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("[AC-003] renders server field-level validation messages on a 422 from signup", async () => {
    fetchMock.mockReturnValueOnce(
      jsonResponse(422, {
        detail: [
          { loc: ["body", "email"], msg: "value is not a valid email address" },
          { loc: ["body", "password"], msg: "password is too weak" },
        ],
      }),
    );
    const user = userEvent.setup();
    renderAuth();

    await user.click(screen.getByRole("tab", { name: "Create account" }));
    await fillAndSubmit(user, "weird@x.co", "weak-but-ten-chars", "Create account");

    expect(await screen.findByText(/not a valid email address/i)).toBeInTheDocument();
    expect(screen.getByText(/password is too weak/i)).toBeInTheDocument();
  });

  it("[AC-004] posts to /auth/signin and navigates to the dashboard on success", async () => {
    fetchMock.mockReturnValueOnce(jsonResponse(200, { user_id: "u1", email: "ok@example.com" }));
    const user = userEvent.setup();
    renderAuth();

    await fillAndSubmit(user, "ok@example.com", "a-strong-password1", "Sign in");

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/auth/signin");
    expect(init.credentials).toBe("include");

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent(/signed in/i));
  });

  it("[AC-005] shows a generic invalid-credentials message on a 401 from signin, with no hint about the email", async () => {
    fetchMock.mockReturnValueOnce(jsonResponse(401, { detail: "no account with that email" }));
    const user = userEvent.setup();
    renderAuth();

    await fillAndSubmit(user, "nobody@example.com", "a-strong-password1", "Sign in");

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/email or password is incorrect/i);
    expect(alert).not.toHaveTextContent(/no account with that email/i);
  });

  it("does not render any seeded REGISTERED/DEMO accounts or prefill credentials", () => {
    renderAuth();
    expect(screen.getByLabelText(/email/i)).toHaveValue("");
    expect(screen.getByLabelText(/password/i)).toHaveValue("");
    expect(screen.queryByText(/demo account/i)).not.toBeInTheDocument();
  });
});
