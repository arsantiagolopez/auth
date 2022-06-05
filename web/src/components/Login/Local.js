import { CheckIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { Login as LoginMutation } from "../../graphql/mutations/user";
import { useDelay } from "../../utils/useDelay";
import { LoadingOverlay } from "../LoadingOverlay";
import { ForgotPasswordModal } from "../Modals";
import { SuccessfulLogin as SuccessfulLoginScreen } from "../Screens";

const Local = ({ isLocalActive, setIsLocalActive }) => {
  const [fadeIn, setFadeIn] = useState(isLocalActive);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);

  const [, loginMutation] = useMutation(LoginMutation);

  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
    watch,
  } = useForm();

  const router = useRouter();

  const onSubmit = async (values) => {
    const { email, password } = values;

    // Show a spinner on any submit
    setIsLoading(true);

    // Show spinner for 1000 ms
    await useDelay(1000);

    const { data } = await loginMutation({
      input: { email, password },
    });

    // Hide spinner
    setIsLoading(false);

    // Handle server errors
    if (data?.login.errors) {
      const serverErrors = data.login.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.login.user) {
      // Login successful
      setIsLoggedIn(true);

      // Wait for animation to run
      await useDelay(1500);

      // Redirect to dashboard
      router.push("/dashboard");
    }
  };

  // Individual registration allows for onChange destructure
  const { onChange, ...passwordRegister } = register("password", {
    required: "This field is required",
  });

  // Reset global errors on password field change
  const handlePasswordChange = (e) => {
    if (errors.credentials) {
      clearErrors("credentials");
    }
    // Must pass onChange to keep useForm default bahaviour
    onChange(e);
  };

  // Update animation on screen transition
  useEffect(() => {
    if (isLocalActive) {
      setFadeIn(true);
    }
  }, [isLocalActive]);

  const forgotPasswordProps = {
    emailWatch: watch("email"),
    isForgotOpen,
    setIsForgotOpen,
  };

  return (
    <Flex {...styles.wrapper} animation={fadeIn && "fadeIn 0.4s ease-in-out"}>
      {!isLoggedIn ? (
        <>
          <Heading {...styles.heading}>Log in</Heading>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <Flex {...styles.fields}>
              <Input
                placeholder="Your email"
                {...styles.input}
                {...register("email", {
                  required: "This field is required",
                  pattern: {
                    // Minimal email validation
                    value: /\S+@\S+\.\S+/,
                    message: "Please input a valid email address",
                  },
                })}
              />
              {errors.email && (
                <Text {...styles.error}>{errors.email.message}</Text>
              )}

              <Input
                type="password"
                placeholder="Your password"
                {...styles.input}
                {...passwordRegister}
                onChange={handlePasswordChange}
              />
              {errors.password && (
                <Text {...styles.error}>{errors.password.message}</Text>
              )}

              {/* Global error message */}
              {errors.credentials && (
                <Text {...styles.error}>{errors.credentials.message}</Text>
              )}

              <Button
                type="submit"
                {...styles.button}
                rightIcon={<CheckIcon boxSize="0.75em" />}
              >
                Log in
              </Button>
            </Flex>
          </form>

          <Button {...styles.link} onClick={() => setIsLocalActive(false)}>
            Back to other logins?
          </Button>

          {/* Forgot password link */}

          <Button
            onClick={() => setIsForgotOpen(true)}
            {...styles.forgotPassword}
          >
            Forgot your password?
          </Button>

          {/* Loading spinner overlay */}
          <LoadingOverlay isLoading={isLoading} />

          {/* Absolutely positioned modal */}
          <ForgotPasswordModal {...forgotPasswordProps} />
        </>
      ) : (
        <SuccessfulLoginScreen />
      )}
    </Flex>
  );
};

export { Local };

// Styles

const styles = {
  wrapper: {
    height: "100%",
    width: "100%",
    align: "center",
    direction: "column",
  },
  heading: {
    flex: "2",
    letterSpacing: "tight",
    color: "heading",
    fontSize: { base: "5xl", md: "6xl" },
  },
  form: {
    flex: "3",
    width: "100%",
  },
  fields: {
    justify: "space-around",
    direction: "column",
    height: "100%",
    width: "100%",
  },
  error: {
    fontSize: "sm",
    color: "link",
    paddingTop: "1",
    paddingBottom: "2",
    paddingX: "1",
    lineHeight: "1em",
  },
  link: {
    flex: "1",
    as: "a",
    variant: "link",
    color: "link",
    cursor: "pointer",
  },
  button: {
    color: "heading",
    width: "100%",
    background: "link",
  },
  input: {
    background: "tertiary",
    spellCheck: "false",
    variant: "filled",
    _focus: {
      borderColor: "secondary",
    },
  },
  forgotPassword: {
    position: "absolute",
    bottom: "0",
    marginY: { base: "7em", md: "min(10vh, 7vw)" },
    variant: "link",
    color: "heading",
    fontWeight: "normal",
    textDecor: "underline",
  },
};
