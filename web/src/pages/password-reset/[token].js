import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { withUrqlClient } from "next-urql";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { Layout } from "../../components/Layout";
import { SuccessfulUpdate } from "../../components/Screens";
import { ResetPassword as ResetPasswordMutation } from "../../graphql/mutations/user";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { useDelay } from "../../utils/useDelay";

const PasswordReset = () => {
  const [isChanged, setIsChanged] = useState(false);

  const [, resetPasswordMutation] = useMutation(ResetPasswordMutation);
  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    watch,
  } = useForm();

  const router = useRouter();

  const onSubmit = async (values) => {
    const { password } = values;

    // Get token from query param
    const {
      query: { token },
    } = router;

    const { data } = await resetPasswordMutation({
      input: { token, password },
    });

    // Handle server errors
    if (data?.resetPassword.errors) {
      const serverErrors = data.resetPassword.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.resetPassword.user) {
      // Password reset successful
      setIsChanged(true);

      await useDelay(1000);

      // Redirect to dashboard
      router.push("/dashboard");

      await useDelay(2000);

      setIsChanged(false);
    }
  };

  // Check errors & set to true if token related
  const tokenErrors = ["token", "tokenExpired"];
  const errorProps = Object.keys(errors);

  // Check if any error in the errors object
  // matches any string in tokenErrors
  const isTokenRelatedError = errorProps.some((str) =>
    tokenErrors.includes(str)
  );

  return (
    <Layout hideNavigation>
      <Head>
        <title>Reset Your Password - Authentication</title>
      </Head>
      <Flex {...styles.wrapper}>
        <Flex {...styles.content}>
          {!isChanged ? (
            <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
              <Flex {...styles.form}>
                {/* Heading */}
                <Heading {...styles.heading}>Password reset</Heading>

                {!isTokenRelatedError ? (
                  <>
                    {/* New password */}
                    <Flex {...styles.field}>
                      <Heading {...styles.label}>New password</Heading>
                      <Input
                        type="password"
                        {...register("password", {
                          required: "Please input a new password",
                          minLength: {
                            value: 5,
                            message:
                              "Password must be at least 5 characters long",
                          },
                          maxLength: {
                            value: 50,
                            message:
                              "Password too long. Please try less characters",
                          },
                        })}
                        {...styles.input}
                      />
                      {errors && errors.password && (
                        <Text {...styles.error}>{errors.password.message}</Text>
                      )}
                    </Flex>

                    {/* Confirm new password */}
                    <Flex {...styles.field}>
                      <Heading {...styles.label}>Confirm password</Heading>
                      <Input
                        type="password"
                        {...styles.input}
                        {...register("passwordConfirm", {
                          required: "Confirm your password",
                          validate: {
                            matching: (value) =>
                              value === watch("password") ||
                              "Passwords don't match.",
                          },
                        })}
                      />
                      {errors && errors.passwordConfirm && (
                        <Text {...styles.error}>
                          {errors.passwordConfirm.message}
                        </Text>
                      )}
                    </Flex>

                    <Button
                      type="submit"
                      {...styles.button}
                      marginTop={errors.confirmPassword ? "3" : "1em"}
                    >
                      Save
                    </Button>
                  </>
                ) : (
                  // Without a token, user won't be able to
                  // reset/recover their password. Cancel
                  // procedure and ask them to try again
                  <>
                    {errors && errors.tokenExpired && (
                      <Text {...styles.error} paddingBottom="1.5em">
                        {errors.tokenExpired.message}
                      </Text>
                    )}
                    {errors && errors.token && (
                      <Text {...styles.error}>{errors.token.message}</Text>
                    )}
                    <Link href="/auth">
                      <Button
                        {...styles.button}
                        marginTop={errors.confirmPassword ? "3" : "1em"}
                      >
                        Take me back
                      </Button>
                    </Link>
                  </>
                )}
              </Flex>
            </form>
          ) : (
            <SuccessfulUpdate field="password" />
          )}
        </Flex>
      </Flex>
    </Layout>
  );
};

export default withUrqlClient(createUrqlClient)(PasswordReset);

// Styles

const styles = {
  wrapper: {
    align: "center",
    justify: "center",
    width: "100%",
    height: "100vh",
    background: "primary",
  },
  content: {
    align: "center",
    width: "30%",
    minWidth: "20em",
    background: "secondary",
    borderRadius: "1em",
    paddingY: { base: "2em", md: "3vw" },
    paddingX: { base: "2em", md: "max(2.5em, 3vw)" },
    overflowX: "hidden",
  },
  form: {
    width: "100%",
    direction: "column",
  },
  heading: {
    letterSpacing: "tight",
    color: "heading",
    fontSize: { base: "4xl", md: "min(2.5em, 4vw)" },
    paddingBottom: "0.5em",
  },
  field: {
    direction: "column",
    paddingBottom: "0.5em",
    width: "100%",
  },
  label: {
    size: "sm",
    color: "heading",
    paddingY: "2",
  },
  input: {
    background: "tertiary",
    spellCheck: "false",
    _focus: {
      borderColor: "tertiary",
    },
  },
  error: {
    color: "link",
    lineHeight: "1em",
    paddingY: "1",
  },
  button: {
    background: "link",
    color: "heading",
    minWidth: "5em",
    borderRadius: "0.5em",
    height: "3em",
  },
};
