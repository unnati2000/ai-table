import {
  Input,
  Modal,
  ModalBody,
  ModalContent,
  Button,
} from "@nextui-org/react";

export const ViewModal = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent>
        <ModalBody className="p-4 flex flex-col gap-4">
          <p className="text-lg font-medium">Add this view to your list</p>

          <div className="flex flex-col gap-6">
            <Input
              label="Table view name"
              size="md"
              placeholder="Sales for 2024"
              labelPlacement="outside"
            />

            <Input
              label="Table view slug"
              size="md"
              placeholder="sales-for-2024"
              labelPlacement="outside"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="bordered" color="primary">
              Cancel
            </Button>

            <Button variant="solid" color="primary">
              Save
            </Button>
          </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

