import { CheckIcon } from "@chakra-ui/icons";
import { Button, Flex, Heading, Input, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useMutation } from "urql";
import { Register as RegisterMutation } from "../../graphql/mutations/user";
import { useDelay } from "../../utils/useDelay";
import { LoadingOverlay } from "../LoadingOverlay";
import { SuccessfulSignup } from "../Screens";
import { UpdateAvatar } from "../UpdateAvatar";

const CompleteProfile = ({ isReady }) => {
  const [fadeIn, _] = useState(isReady);
  const [isUrlActive, setIsUrlActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const [, registerMutation] = useMutation(RegisterMutation);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    control,
  } = useForm();

  const router = useRouter();

  // Only submit on valid fields
  const onSubmit = async (values) => {
    const { picture, name } = values;
    const { email, password } = isReady;

    // Show a spinner on any submit
    setIsLoading(true);

    // Show spinner for 1000 ms
    await useDelay(1000);

    const { data } = await registerMutation({
      input: { email, password, picture, name },
    });

    // Hide spinner
    setIsLoading(false);

    // Handle server errors
    if (data?.register.errors) {
      const serverErrors = data.register.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.register.profile) {
      // Login successful
      setIsCompleted(true);

      // Wait for animation to run
      await useDelay(1500);

      // Redirect to dashboard
      router.push("/dashboard");
    }
  };

  const updateAvatarProps = {
    isUrlActive,
    setIsUrlActive,
  };

  return (
    <Flex {...styles.wrapper} animation={fadeIn && "fadeIn 0.4s ease-in-out"}>
      {!isCompleted ? (
        <>
          <Flex {...styles.headingContainer}>
            <Heading {...styles.heading}>Almost done!</Heading>
            <Text {...styles.subheading}>Let's create your profile</Text>
          </Flex>

          <form onSubmit={handleSubmit(onSubmit)} style={styles.form}>
            <Flex
              {...styles.fields}
              marginTop={isUrlActive ? "1em" : "2"}
              paddingY={isUrlActive ? "1.5em" : "none"}
            >
              {/* Controller field registration for custom fields */}
              <Controller
                control={control}
                name="picture"
                rules={{
                  required: "Please add a valid picture URL",
                }}
                render={({ field: { onChange } }) => (
                  <UpdateAvatar
                    {...updateAvatarProps}
                    {...{ onChange, errors }}
                  />
                )}
              />

              <Input
                placeholder="Your name"
                {...styles.input}
                {...register("name", {
                  required: "What's your name?",
                  minLength: {
                    value: 3,
                    message: "Your name must be at least 3 letters",
                  },
                  maxLength: {
                    value: 100,
                    message: "Your name's too long. Try less characters",
                  },
                })}
              />
              {errors.name && (
                <Text {...styles.error}>{errors.name.message}</Text>
              )}

              <Button
                type="submit"
                {...styles.button}
                rightIcon={<CheckIcon boxSize="0.75em" />}
              >
                Complete signup
              </Button>
            </Flex>
          </form>

          {/* Loading spinner overlay */}
          <LoadingOverlay isLoading={isLoading} />
        </>
      ) : (
        <SuccessfulSignup />
      )}
    </Flex>
  );
};

export { CompleteProfile };

// Styles

const styles = {
  wrapper: {
    height: "100%",
    width: "100%",
    align: "center",
    direction: "column",
  },
  headingContainer: {
    flex: "1",
    justify: "center",
    align: "center",
    direction: "column",
  },
  heading: {
    letterSpacing: "tight",
    color: "heading",
    fontSize: { base: "4xl", md: "min(3em, 4vw)" },
  },
  subheading: {
    color: "heading",
  },
  form: {
    flex: "3",
    width: "100%",
  },
  fields: {
    justify: "space-around",
    direction: "column",
    width: "100%",
    height: "100%",
  },
  button: {
    bg: "tertiary",
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
  error: {
    fontSize: "sm",
    color: "link",
    paddingBottom: "2",
    paddingX: "1",
    lineHeight: "1em",
  },
};
