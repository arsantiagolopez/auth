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
import { ChangePassword as ChangePasswordMutation } from "../../graphql/mutations/user";
import { useDelay } from "../../utils/useDelay";
import { SuccessfulUpdate } from "../Screens";

// Updates the password field

const PasswordChangeModal = ({ activeEdit, setActiveEdit }) => {
  const [isChanged, setIsChanged] = useState(false);
  const isOpen = activeEdit === "password";

  const [, changePasswordMutation] = useMutation(ChangePasswordMutation);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (values) => {
    const { password, newPassword } = values;

    const { data } = await changePasswordMutation({
      input: { password, newPassword },
    });

    // Handle server errors
    if (data?.changePassword.errors) {
      const serverErrors = data.changePassword.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.changePassword.success) {
      // Signup successful
      setIsChanged(true);

      // Wait for animation to run
      await useDelay(2000);

      // Reset state & fields
      setActiveEdit(null);
      setIsChanged(false);
      reset();
    }
  };

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent {...styles.content}>
        {!isChanged ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              {/* Current password */}
              <Flex {...styles.field}>
                <Heading {...styles.label}>Current password</Heading>
                <Input
                  type="password"
                  {...register("password", {
                    required: "What's your current password?",
                  })}
                  {...styles.input}
                />
                {errors && errors.password && (
                  <Text {...styles.error}>{errors.password.message}</Text>
                )}
              </Flex>
              {/* New password */}
              <Flex {...styles.field}>
                <Heading {...styles.label}>New password</Heading>
                <Input
                  type="password"
                  {...styles.input}
                  {...register("newPassword", {
                    required: "What do you want your new password to be?",
                    minLength: {
                      value: 5,
                      message: "Password must be at least 5 characters long",
                    },
                  })}
                />
                {errors && errors.newPassword && (
                  <Text {...styles.error}>{errors.newPassword.message}</Text>
                )}
              </Flex>
            </ModalBody>
            <ModalFooter {...styles.footer}>
              <Button
                onClick={() => setActiveEdit(null)}
                {...styles.button}
                background="tertiary"
              >
                Cancel
              </Button>
              <Button type="submit" {...styles.button}>
                Save
              </Button>
            </ModalFooter>
          </form>
        ) : (
          <SuccessfulUpdate field="password" />
        )}
      </ModalContent>
    </Modal>
  );
};

export { PasswordChangeModal };

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
