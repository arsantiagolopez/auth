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
  Textarea,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { UpdateProfile as UpdateProfileMutation } from "../../graphql/mutations/user";
import { useDelay } from "../../utils/useDelay";
import { SuccessfulUpdate } from "../Screens";

// Updates fields "name" and "bio"

const UpdateProfileModal = ({ activeEdit, setActiveEdit }) => {
  const [isChanged, setIsChanged] = useState(false);

  const profileFields = ["name", "bio", "picture"];
  const isOpen = profileFields.includes(activeEdit);

  const [, updateProfileMutation] = useMutation(UpdateProfileMutation);

  const {
    handleSubmit,
    register,
    setError,
    formState: { errors },
    reset,
    unregister,
  } = useForm();

  // Test for common image extensions
  const validateImageUrl = (url) => {
    const extensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp"];

    const hasExtension = extensions.some((str) => url.includes(str));

    if (!hasExtension) {
      return false;
    }

    return true;
  };

  const onSubmit = async (values) => {
    // Dynamically get first prop of values object
    const [key, value] = Object.entries(values)[0];

    const { data } = await updateProfileMutation({
      input: { [key]: value },
    });

    // Handle server errors
    if (data?.updateProfile.errors) {
      const serverErrors = data.updateProfile.errors;

      // Set manual form errors
      serverErrors.forEach(({ field, message }) =>
        setError(field, { type: "manual", message })
      );
    } else if (data?.updateProfile.profile) {
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

  // Dynamic field info & form registration
  const fieldInfo = {
    name: {
      label: "Display name",
      registration:
        activeEdit !== "name"
          ? {}
          : register("name", {
              required: "What's your name?",
              minLength: {
                value: 3,
                message: "Your name must be at least 3 letters",
              },
              maxLength: {
                value: 100,
                message: "Your name's too long. Try less characters",
              },
            }),
    },
    bio: {
      label: "Bio",
      registration:
        activeEdit !== "bio"
          ? {}
          : register("bio", {
              required: "What's something you want others to know?",
              maxLength: {
                value: 140,
                message: "Keep it simple. Try less than 140 characters",
              },
            }),
    },
    picture: {
      label: "Picture URL",
      registration:
        activeEdit !== "picture"
          ? {}
          : register("picture", {
              required: "Please add a picture URL",
              validate: {
                isImage: (value) =>
                  validateImageUrl(value) ||
                  `Only supports links that end with ".jpg", ".png", ".gif", or other common file extensions.`,
              },
            }),
    },
  };

  // Unregister non-active fields
  useEffect(() => {
    if (activeEdit === "name") {
      return unregister(["bio", "picture"]);
    }
    if (activeEdit === "bio") {
      return unregister(["name", "picture"]);
    }
    if (activeEdit === "picture") {
      return unregister(["name", "bio"]);
    }
  }, [activeEdit]);

  return (
    <Modal isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent {...styles.content}>
        {!isChanged ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              {/* Dynamic field */}
              <Flex {...styles.field}>
                <Heading {...styles.label}>
                  {fieldInfo[activeEdit]?.label}
                </Heading>
                {activeEdit !== "bio" ? (
                  // Render either name or picture
                  <Input
                    {...fieldInfo[activeEdit]?.registration}
                    {...styles.input}
                  />
                ) : (
                  <Textarea
                    spellCheck="true"
                    placeholder="Type away..."
                    {...fieldInfo.bio.registration}
                    {...styles.input}
                  />
                )}
                {/* Dynamic error */}
                {errors && errors[activeEdit] && (
                  <Text {...styles.error}>{errors[activeEdit]?.message}</Text>
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
          <SuccessfulUpdate field={activeEdit} />
        )}
      </ModalContent>
    </Modal>
  );
};

export { UpdateProfileModal };

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
