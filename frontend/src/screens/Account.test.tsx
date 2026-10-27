import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Account from "./Account";

function renderAccount() {
  return render(
    <MemoryRouter initialEntries={["/account"]}>
      <Routes>
        <Route path="/account" element={<Account />} />
        <Route path="/auth" element={<div>Auth screen</div>} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("Account screen sign-out", () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("[AC-006] posts to /auth/signout with credentials included and returns to the auth screen", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve({ ok: true }),
    } as Response);
    const user = userEvent.setup();
    renderAccount();

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toContain("/auth/signout");
    expect(init.method).toBe("POST");
    expect(init.credentials).toBe("include");

    expect(await screen.findByText("Auth screen")).toBeInTheDocument();
  });

  it("[AC-006] still returns to the auth screen if the signout call itself fails", async () => {
    fetchMock.mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: () => Promise.resolve({ detail: "boom" }),
    } as Response);
    const user = userEvent.setup();
    renderAccount();

    await user.click(screen.getByRole("button", { name: /sign out/i }));

    expect(await screen.findByText("Auth screen")).toBeInTheDocument();
  });
});
