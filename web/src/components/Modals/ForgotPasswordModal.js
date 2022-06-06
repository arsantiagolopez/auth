import {
  Button,
  Flex,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { ForgotPassword as ForgotPasswordMutation } from "../../graphql/mutations/user";
import { useDelay } from "../../utils/useDelay";
import { SuccessfulEmailSent } from "../Screens";

const ForgotPasswordModal = ({ emailWatch, isForgotOpen, setIsForgotOpen }) => {
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [, forgotPasswordMutation] = useMutation(ForgotPasswordMutation);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    watch,
  } = useForm();

  const onSubmit = async (values) => {
    const { email } = values;

    const { data } = await forgotPasswordMutation({ email });

    // Handle server errors
    if (data?.forgotPassword.errors) {
      const serverErrors = data.forgotPassword.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.forgotPassword.success) {
      // Show success screen
      setIsEmailSent(true);

      // Wait for animation to run
      await useDelay(4000);

      // Close both modals
      setIsForgotOpen(false);
      setIsEmailSent(false);
    }
  };

  return (
    <Modal isOpen={isForgotOpen} isCentered>
      <ModalOverlay />
      <ModalContent {...styles.content}>
        {!isEmailSent ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Flex {...styles.field}>
                <Heading {...styles.label}>Your email</Heading>
                <Input
                  defaultValue={emailWatch}
                  {...register("email", {
                    required: "Where do you want to send the link to?",
                    pattern: {
                      // Minimal email validation
                      value: /\S+@\S+\.\S+/,
                      message: "Are you sure this is an email? 🤔",
                    },
                  })}
                  {...styles.input}
                />
                {errors && errors.email && (
                  <Text {...styles.error}>{errors.email.message}</Text>
                )}
              </Flex>
            </ModalBody>
            <ModalFooter {...styles.footer}>
              <Button
                onClick={() => setIsForgotOpen(false)}
                {...styles.button}
                background="tertiary"
              >
                Nevermind
              </Button>
              <Button type="submit" {...styles.button}>
                Send reset link
              </Button>
            </ModalFooter>
          </form>
        ) : (
          <SuccessfulEmailSent email={watch("email")} />
        )}
      </ModalContent>
    </Modal>
  );
};

export { ForgotPasswordModal };

// Styles

const styles = {
  content: {
    background: "secondary",
    borderRadius: "0.5em",
    paddingY: { base: "1em", base: "1.5em" },
    paddingX: "1vw",
    width: { base: "90%", md: "50%" },
    marginY: "auto",
  },
  field: {
    direction: "column",
    paddingBottom: "0.5em",
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
  footer: {
    direction: "row",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingY: "0.5em",
  },
  button: {
    background: "link",
    color: "heading",
    marginX: "2",
    minWidth: "5em",
  },
};
