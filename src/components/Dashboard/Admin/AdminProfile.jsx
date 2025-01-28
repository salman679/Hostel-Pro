import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../../../contexts/AuthContext";
import {
  Badge,
  Box,
  Flex,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";

export default function AdminProfile() {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: adminStats = {} } = useQuery({
    queryKey: ["adminStats"],
    queryFn: async () => {
      const res = await axiosSecure.get("/meals/admin", {
        params: { email: user?.email },
      });
      return res.data;
    },
  });

  return (
    <Box
      bg="white"
      p={8}
      rounded="lg"
      shadow="lg"
      maxW="md"
      mx="auto"
      className="bg-gradient-to-tr from-blue-100 to-indigo-50"
    >
      <Flex align="center" mb={6}>
        {/* Admin Profile Image */}
        <Box
          w={16}
          h={16}
          rounded="full"
          overflow="hidden"
          borderWidth={2}
          borderColor="gray.300"
        >
          <Image
            src={user?.photoURL || "https://i.ibb.co/HBx04n5/images.jpg"}
            alt="Admin Profile"
            boxSize="full"
            objectFit="cover"
          />
        </Box>

        <Stack ml={4} spacing={1}>
          <Heading size="md" color="gray.800">
            {user?.displayName || "Admin Name"}
          </Heading>
          <Text fontSize="sm" color="gray.500">
            {user?.email || "admin@example.com"}
          </Text>
          <Badge colorScheme="blue" px={2} py={1} rounded="md">
            Admin
          </Badge>
        </Stack>
      </Flex>

      {/* Admin Stats Section */}
      <Box mt={4}>
        <Heading size="sm" color="gray.700" mb={3}>
          Admin Stats
        </Heading>

        <Stack spacing={3}>
          <Flex justify="space-between" align="center">
            <Text fontWeight="semibold" color="gray.600">
              Meals Added:
            </Text>
            <Text color="blue.600" fontWeight="bold">
              {adminStats.count}
            </Text>
          </Flex>
        </Stack>
      </Box>
    </Box>
  );
}
