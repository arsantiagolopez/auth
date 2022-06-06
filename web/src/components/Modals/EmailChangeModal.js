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
import { ChangeEmail as ChangeEmailMutation } from "../../graphql/mutations/user";
import { useDelay } from "../../utils/useDelay";
import { SuccessfulUpdate } from "../Screens";

// Updates the email field

const EmailChangeModal = ({ activeEdit, setActiveEdit }) => {
  const [isChanged, setIsChanged] = useState(false);
  const isOpen = activeEdit === "email";

  const [, changeEmailMutation] = useMutation(ChangeEmailMutation);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    reset,
  } = useForm();

  const onSubmit = async (values) => {
    const { email, password } = values;

    const { data } = await changeEmailMutation({
      input: { email, password },
    });

    // Handle server errors
    if (data?.changeEmail.errors) {
      const serverErrors = data.changeEmail.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.changeEmail.success) {
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
              {/* New email */}
              <Flex {...styles.field}>
                <Heading {...styles.label}>Email</Heading>
                <Input
                  {...register("email", {
                    required: "What's your new email?",
                  })}
                  {...styles.input}
                />
                {errors && errors.email && (
                  <Text {...styles.error}>{errors.email.message}</Text>
                )}
              </Flex>

              {/* Password */}
              <Flex {...styles.field}>
                <Heading {...styles.label}>Password</Heading>
                <Input
                  type="password"
                  {...register("password", {
                    required:
                      "Your current password is needed for confirmation.",
                  })}
                  {...styles.input}
                />
                {errors && errors.password && (
                  <Text {...styles.error}>{errors.password.message}</Text>
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
          <SuccessfulUpdate field="email" />
        )}
      </ModalContent>
    </Modal>
  );
};

export { EmailChangeModal };

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
