import { useState } from "react";
import type { FormEvent } from "react";
import { Login, useLogin, useNotify } from "react-admin";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { requestOtp } from "../api/auth";

const PHONE_REGEX =
  /^(?:(?:(?:\+?|00)(98))|(0))?((?:90|91|92|93|99)[0-9]{8})$/;

export const LoginPage = () => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const login = useLogin();
  const notify = useNotify();

  const handleSendCode = async () => {
    const trimmedPhone = phoneNumber.trim();

    if (!PHONE_REGEX.test(trimmedPhone)) {
      notify("Please enter a valid phone number", { type: "warning" });
      return;
    }

    setLoading(true);
    try {
      const response = await requestOtp(trimmedPhone);
      setPhoneNumber(trimmedPhone);
      setCodeSent(true);
      notify(
        response.code
          ? `Verification code sent (${response.code})`
          : "Verification code sent",
        { type: "info" }
      );
    } catch (error: unknown) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response
          ?.data?.message ?? "Failed to send verification code";
      notify(message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (event: FormEvent) => {
    event.preventDefault();

    if (!/^\d{4}$/.test(code)) {
      notify("Verification code must be 4 digits", { type: "warning" });
      return;
    }

    setLoading(true);
    try {
      await login({ phoneNumber: phoneNumber.trim(), code });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Login failed";
      notify(message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Login>
      <Card
        sx={{
          minWidth: 320,
          maxWidth: 420,
          width: "100%",
        }}
      >
        <CardContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 0.5,
              }}
            >
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                Admin Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Sign in with your admin phone number and verification code.
              </Typography>
            </Box>

            {!codeSent ? (
              <Box
                component="form"
                onSubmit={(event) => {
                  event.preventDefault();
                  void handleSendCode();
                }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Phone number"
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  fullWidth
                  autoFocus
                  placeholder="09XXXXXXXXX"
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  Send code
                </Button>
              </Box>
            ) : (
              <Box
                component="form"
                onSubmit={(event) => {
                  void handleLogin(event);
                }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <TextField
                  label="Phone number"
                  value={phoneNumber}
                  disabled
                  fullWidth
                />
                <TextField
                  label="Verification code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  fullWidth
                  autoFocus
                  inputProps={{ maxLength: 4, inputMode: "numeric" }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  fullWidth
                >
                  Login
                </Button>
                <Button
                  type="button"
                  variant="text"
                  disabled={loading}
                  onClick={() => {
                    setCodeSent(false);
                    setCode("");
                  }}
                >
                  Change phone number
                </Button>
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Login>
  );
};
