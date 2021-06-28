import { CheckIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useClient } from "urql";
import { CheckEmailAvailability as CheckEmailAvailabilityQuery } from "../../graphql/queries/user";
import { useDelay } from "../../utils/useDelay";
import { LoadingOverlay } from "../LoadingOverlay";

const Registration = ({ handleClick, slideLeft, setIsReady }) => {
  const [isLoading, setIsLoading] = useState(false);

  const client = useClient();

  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (values) => {
    const { email, password } = values;

    // Show a spinner on any submit
    setIsLoading(true);

    // Show spinner for 1000 ms
    await useDelay(1000);

    // Check if email available
    const {
      data: { checkEmailAvailability },
    } = await client.query(CheckEmailAvailabilityQuery, { email }).toPromise();

    // Hide spinner
    setIsLoading(false);

    // Email not available
    if (!checkEmailAvailability) {
      // Set manual form errors
      setError("email", {
        type: "manual",
        message: "User with that email already exists.",
      });
    } else {
      // Preregistration passed
      setIsReady({ email, password });
    }
  };

  // Individual registration allows for onChange destructure
  const { onChange, ...emailRegister } = register("email", {
    required: "An email is required",
    pattern: {
      // Minimal email validation
      value: /\S+@\S+\.\S+/,
      message: "Please input a valid email address",
    },
  });

  // Reset global errors on email field change
  const handleEmailChange = (e) => {
    if (errors.credentials) {
      clearErrors("credentials");
    }
    // Must pass onChange to keep useForm default bahaviour
    onChange(e);
  };

  return (
    <Flex
      {...styles.wrapper}
      animation={!slideLeft && "slideRight 0.4s ease-in-out"}
    >
      <Heading {...styles.heading}>Sign up</Heading>

      <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
        <Flex {...styles.fields}>
          <Input
            placeholder="Your email"
            onChange={handleEmailChange}
            {...styles.input}
            {...emailRegister}
          />
          {errors.email && (
            <Text {...styles.error}>{errors.email.message}</Text>
          )}

          <Input
            type="password"
            placeholder="Your password"
            {...styles.input}
            {...register("password", {
              required: "A password is required",
              minLength: {
                value: 5,
                message: "Password must be at least 5 characters long",
              },
              maxLength: {
                value: 50,
                message: "Password too long. Try less than 50 characters",
              },
            })}
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
            Sign up
          </Button>
        </Flex>
      </form>

      <Button {...styles.link} onClick={handleClick}>
        Go back?
      </Button>

      {/* Loading spinner overlay */}
      <LoadingOverlay isLoading={isLoading} />
    </Flex>
  );
};

export { Registration };

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
  input: {
    background: "tertiary",
    spellCheck: "false",
    variant: "filled",
    _focus: {
      borderColor: "secondary",
    },
  },
  error: {
    fontSize: "sm",
    color: "link",
    paddingTop: "1",
    paddingBottom: "2",
    paddingX: "1",
    lineHeight: "1em",
  },
  button: {
    bg: "tertiary",
    color: "heading",
    width: "100%",
    background: "link",
  },
  link: {
    flex: "1",
    as: "a",
    variant: "link",
    color: "link",
    cursor: "pointer",
  },
};
