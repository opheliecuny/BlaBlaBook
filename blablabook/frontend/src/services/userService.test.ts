import { describe, it, expect, vi, beforeEach } from "vitest";
import { updateProfile, getProfile, deleteProfile } from "./userService";
import { apiClient } from "@/lib/api";

vi.mock("@/lib/api", () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockApiClient = vi.mocked(apiClient);

beforeEach(() => {
  vi.clearAllMocks();
});

describe("userService", () => {
  describe("getProfile()", () => {
    it("appelle GET /user/profile", async () => {
      mockApiClient.get.mockResolvedValueOnce({ id: "1", email: "a@b.com", username: "alice" });
      await getProfile();
      expect(mockApiClient.get).toHaveBeenCalledWith("/user/profile");
    });

    it("retourne les données du profil", async () => {
      const profile = { id: "1", email: "a@b.com", username: "alice" };
      mockApiClient.get.mockResolvedValueOnce(profile);
      const result = await getProfile();
      expect(result).toEqual(profile);
    });
  });

  describe("updateProfile()", () => {
    it("appelle PATCH /user/profile avec les données", async () => {
      const data = { username: "newname" };
      mockApiClient.patch.mockResolvedValueOnce({ message: "User updated successfully" });
      await updateProfile(data);
      expect(mockApiClient.patch).toHaveBeenCalledWith("/user/profile", data);
    });

    it("retourne la réponse du serveur", async () => {
      const response = { message: "User updated successfully", user: { id: "1" } };
      mockApiClient.patch.mockResolvedValueOnce(response);
      const result = await updateProfile({ username: "newname" });
      expect(result).toEqual(response);
    });
  });

  describe("deleteProfile()", () => {
    it("appelle DELETE /user", async () => {
      mockApiClient.delete.mockResolvedValueOnce(null);
      await deleteProfile();
      expect(mockApiClient.delete).toHaveBeenCalledWith("/user");
    });
  });
});
