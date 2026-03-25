import axios from "axios";
import { useTokens } from "@/stores/useTokens";

export const refreshTokens = async () => {
  try {
    const { refreshToken } = useTokens.getState();
    const { data, status } = await axios.post(
      "https://ilkinibadov.com/api/v1/auth/refresh",
      { refreshToken }
    );

    if (status === 200) {
      useTokens.getState().setAccessToken(data.accessToken);
      return data.accessToken;
    }
  } catch (error) {
    console.error("Token refresh failed:", error);
    useTokens.getState().clearTokens();
    return null;
  }
};
