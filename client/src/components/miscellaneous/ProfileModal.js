import { ViewIcon } from "@chakra-ui/icons";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  IconButton,
  Text,
  Image,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { apiConnector } from "../../services/apiConnector";
import { authendpoints } from "../../services/apis";
import { ChatState } from "../../Context/ChatProvider";
import toast from "react-hot-toast";

const ProfileModal = ({ user, children }) => {
  const {UPDATE_DISPLAY_PICTURE_API} = authendpoints;
  const { isOpen, onOpen, onClose } = useDisclosure();
  // console.log(user);
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [previewSource, setPreviewSource] = useState(null)
  const { setUser} = ChatState();

  const fileInputRef = useRef(null)

  const handleClick = () => {
    fileInputRef.current.click()
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    console.log("file is :",file)

    const formData = new FormData()
    formData.append("displayPicture", imageFile)
    console.log("formdata", formData)
    if (file) {
      setImageFile(file)
      previewFile(file)
    }
  }

  const previewFile = (file) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
      // console.log("reading file:",reader.result);
      setPreviewSource(reader.result)
    }
  }

  const handleFileUpload = async () => {
    setLoading(true);
      try {
        const token = user.token;
        // console.log("In handle file upload");
        const formData = new FormData()
        formData.append("displayPicture", imageFile)
        // console.log("Api is : ",UPDATE_DISPLAY_PICTURE_API );
        const response  = await apiConnector("PUT", UPDATE_DISPLAY_PICTURE_API,formData,{
          Authorization: `Bearer ${user.token}`,
          }
        )
        const data =response?.data?.data;
        data.token = token; 
          setUser(data);
          
          console.log("Response is :" , response);
        setLoading(false);
        toast.success("Display Picture Updated Successfully")
      } 
      
      catch (error) {
        console.log("Error is :",error);
        toast.error("Error in uploading Profile picture");
        setLoading(false);
        return;
      }
      setLoading(false);
  }

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />
      )}
      <Modal size="lg" onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />

        <ModalContent h="410px">

          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            d="flex"
            justifyContent="center"
          >
            {user?.name}
          </ModalHeader>

          <ModalCloseButton />

          <ModalBody
            d="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
              <div className="flex flex-row justify-evenly">
                <Image
                    borderRadius="full"
                    boxSize="150px"
                    src={previewSource || user?.pic}
                    alt={user?.name}
                  />

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/png, image/gif, image/jpeg"
               />
                  <div className="flex flex-col mt-4 gap-3">
                  <p className="text-xl font-bold">Change Profile Picture</p>
                    <button
                    onClick={handleClick}
                    className="cursor-pointer rounded-md bg-[green] py-2 px-5 font-semibold text-richblack-50">
                    select
                    
                    </button>

                    <button
                      onClick={handleFileUpload}
                      className="cursor-pointer rounded-md bg-[green] py-2 px-5 font-semibold text-richblack-50">
                      {loading ? "Uploading..." : "Upload"}
                    </button>
                  </div>
                  
              </div>

            <div>
              <Text
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
              >
                Email: {user?.email}
              </Text>
            </div>

           


          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>

        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;