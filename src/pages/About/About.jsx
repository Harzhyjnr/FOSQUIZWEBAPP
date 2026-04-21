import { Box, chakra, Flex, useColorModeValue } from "@chakra-ui/react";

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
            <strong>Department of Computer Sciences</strong> under{" "}
            <strong>Faculty of Science</strong>. The project is designed with a
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
