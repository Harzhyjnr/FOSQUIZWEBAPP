import {
  Avatar,
  Box,
  chakra,
  Flex,
  Icon,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";

const testimonials = [
  {
    name: "Hardik Desai",
    role: "Frontend Web Developer",
    content:
      "This quiz web app is built using React JS. It can allow the user to select the criteria for their quiz from a list of options. The user can then proceed to answer the questions in the quiz and their performance will be tracked and shown in the scoreboard. Moreover, the app can be designed to be responsive and user-friendly.",
    avatar: "https://avatars.githubusercontent.com/u/87645745?v=4",
  },
];

function TestimonialCard(props) {
  const { name, role, content, avatar } = props;
  return (
    <Flex
      boxShadow={"lg"}
      maxW={"640px"}
      direction={{ base: "column-reverse", md: "row" }}
      width={"full"}
      rounded={"xl"}
      p={10}
      justifyContent={"space-between"}
      position={"relative"}
      bg={useColorModeValue("white", "gray.800")}
      _after={{
        content: '""',
        position: "absolute",
        height: "21px",
        width: "29px",
        left: "35px",
        top: "-10px",
        backgroundSize: "cover",
        backgroundImage: `url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='29' height='21' viewBox='0 0 29 21' fill='none'%3E%3Cpath d='M6.91391 21C4.56659 21 2.81678 20.2152 1.66446 18.6455C0.55482 17.0758 0 15.2515 0 13.1727C0 11.2636 0.405445 9.43939 1.21634 7.7C2.0699 5.91818 3.15821 4.3697 4.48124 3.05454C5.84695 1.69697 7.31935 0.678787 8.89845 0L13.3157 3.24545C11.5659 3.96667 9.98676 4.94242 8.57837 6.17273C7.21266 7.36061 6.25239 8.63333 5.69757 9.99091L6.01766 10.1818C6.27373 10.0121 6.55114 9.88485 6.84989 9.8C7.19132 9.71515 7.63944 9.67273 8.19426 9.67273C9.34658 9.67273 10.4776 10.097 11.5872 10.9455C12.7395 11.7939 13.3157 13.1091 13.3157 14.8909C13.3157 16.8848 12.6542 18.4121 11.3311 19.4727C10.0508 20.4909 8.57837 21 6.91391 21ZM22.5982 21C20.2509 21 18.5011 20.2152 17.3488 18.6455C16.2391 17.0758 15.6843 15.2515 15.6843 13.1727C15.6843 11.2636 16.0898 9.43939 16.9007 7.7C17.7542 5.91818 18.8425 4.3697 20.1656 3.05454C21.5313 1.69697 23.0037 0.678787 24.5828 0L29 3.24545C27.2502 3.96667 25.6711 4.94242 24.2627 6.17273C22.897 7.36061 21.9367 8.63333 21.3819 9.99091L21.702 10.1818C21.9581 10.0121 22.2355 9.88485 22.5342 9.8C22.8756 9.71515 23.3238 9.67273 23.8786 9.67273C25.0309 9.67273 26.1619 10.097 27.2715 10.9455C28.4238 11.7939 29 13.1091 29 14.8909C29 16.8848 28.3385 18.4121 27.0155 19.4727C25.7351 20.4909 24.2627 21 22.5982 21Z' fill='%239F7AEA'/%3E%3C/svg%3E")`,
      }}
      _before={{
        content: '""',
        position: "absolute",
        zIndex: "-1",
        height: "full",
        maxW: "640px",
        width: "full",
        filter: "blur(40px)",
        transform: "scale(0.98)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        top: 0,
        left: 0,
      }}
    >
      <Flex
        direction={"column"}
        textAlign={"left"}
        justifyContent={"space-between"}
      >
        <chakra.p
          color={"gray.700"}
          fontFamily={"Inter"}
          fontWeight={"medium"}
          fontSize={"15px"}
          pb={4}
        >
          {content}
        </chakra.p>
        <chakra.p
          fontFamily={"Work Sans"}
          color={"gray.800"}
          fontWeight={"bold"}
          fontSize={14}
        >
          {name}
          <chakra.span
            fontFamily={"Inter"}
            fontWeight={"medium"}
            color={"gray.900"}
          >
            {" "}
            - {role}
          </chakra.span>
        </chakra.p>
      </Flex>
      <Avatar
        src={avatar}
        height={"80px"}
        width={"80px"}
        alignSelf={"center"}
        m={{ base: "0 0 35px 0", md: "0 0 0 50px" }}
      />
    </Flex>
  );
}

export default function About() {
  return (
    <Flex
      textAlign={"left"}
      pt={10}
      pb={10}
      justifyContent={"center"}
      direction={"column"}
      width={"full"}
      minH={"80vh"}
    >
      <Box
        width={{ base: "full", sm: "lg", lg: "2xl" }}
        margin={"auto"}
        px={{ base: 4, md: 0 }}
      >
        <chakra.h1
          py={5}
          fontSize={{ base: 36, md: 48 }}
          fontFamily={"Work Sans"}
          fontWeight={"bold"}
          color={useColorModeValue("white.100", "white.100")}
          mb={8}
          textAlign={"center"}
        >
          About This Project
        </chakra.h1>

        <Box
          bg={useColorModeValue("gray.50", "gray.800")}
          p={{ base: 6, md: 10 }}
          rounded={"lg"}
          borderLeft={"5px solid"}
          borderColor={"purple.400"}
          boxShadow={"md"}
        >
          <chakra.p
            fontFamily={"Inter"}
            fontSize={{ base: 16, md: 18 }}
            lineHeight={"1.8"}
            color={useColorModeValue("gray.700", "gray.200")}
            mb={6}
            textAlign={"justify"}
          >
            This <strong>Quiz Web Application</strong> is a comprehensive{" "}
            <strong>Final Year Project</strong> submitted to the{" "}
            <strong>Department of Computer Sciences</strong> under <strong>Faculty of Science</strong>. The project is designed with a
            primary focus on <strong>enhancing student performance</strong>{" "}
            through interactive and engaging educational assessments.
          </chakra.p>

          <chakra.p
            fontFamily={"Inter"}
            fontSize={{ base: 16, md: 18 }}
            lineHeight={"1.8"}
            color={useColorModeValue("gray.700", "gray.200")}
            mb={6}
            textAlign={"justify"}
          >
            The application provides a modern, user-friendly platform that
            empowers students to test their knowledge across various subjects
            and difficulty levels. By offering real-time performance tracking,
            detailed scoreboard analysis, and personalized quiz selection, this
            application aims to foster a deeper understanding of academic
            concepts and encourage continuous self-improvement.
          </chakra.p>

          <chakra.p
            fontFamily={"Inter"}
            fontSize={{ base: 16, md: 18 }}
            lineHeight={"1.8"}
            color={useColorModeValue("gray.700", "gray.200")}
            mb={6}
            textAlign={"justify"}
          >
            Built with cutting-edge web technologies including React.js,
            responsive design principles, and secure user authentication, the
            quiz web app exemplifies modern educational technology. The
            application incorporates features such as category-based question
            selection, adaptive difficulty levels, comprehensive performance
            analytics, and an intuitive map-based quiz interface to create a
            holistic learning experience.
          </chakra.p>

          <chakra.p
            fontFamily={"Inter"}
            fontSize={{ base: 16, md: 18 }}
            lineHeight={"1.8"}
            color={useColorModeValue("gray.700", "gray.200")}
            textAlign={"justify"}
          >
            Through this project, we demonstrate our commitment to leveraging
            technology in education to bridge the gap between traditional
            learning methods and innovative digital solutions. By enabling
            students to engage with content at their own pace and receive
            immediate feedback, we believe this application significantly
            contributes to enhanced academic performance and student engagement.
          </chakra.p>
        </Box>
      </Box>
    </Flex>
  );
}
