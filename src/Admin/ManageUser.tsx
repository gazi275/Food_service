import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";

  

const ManageUser = () => {
    const {users,getAlluser,updateRole}=useUserStore()
    useEffect(() => {
        getAlluser();
      }, [getAlluser]);
      console.log(users);


      const HandleRoleChange=async(id:string,role:string)=>{
        console.log(id,role);
        await updateRole(id,role)
        await getAlluser()

      }
    return (
        <div className="max-w-7xl mx-auto mt-16">
            <Table>
                <TableCaption>A list of users</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-1/4 font-bold text-lg">Name</TableHead>
                        <TableHead className="w-1/4 font-bold text-lg">Email</TableHead>
                        <TableHead className="w-1/4 font-bold text-lg">Role</TableHead>
                        <TableHead className="w-auto text-center font-bold text-lg">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    
                        {users?.map((user:any)=>(

<TableRow key={user.id}>
                            <TableCell className="font-normal text-base ">{user?.fullname}</TableCell>
                            <TableCell className="font-normal text-base ">{user?.email}</TableCell>
                            <TableCell className="font-normal text-base ">{user?.role}</TableCell>
                            <TableCell className="text-right flex gap-4 justify-center">
  <Button
    className={`px-4 py-2 rounded ${
      user.role === "user"
        ? "bg-blue-500 text-white hover:bg-blue-700"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
    onClick={() => user.role === "user" && HandleRoleChange(user._id, "owner")}
    disabled={user.role !== "user"}
  >
    {user.role === "user" ? "Set as Restaurant Owner" : "Change Restricted"}
  </Button>

  {user.role === "owner" && (
                  <Button
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                    onClick={() => HandleRoleChange(user._id, "user")}
                  >
                    Convert to User
                  </Button>
                )}
</TableCell>

                        </TableRow>

                        ))}
                    
                </TableBody>
            </Table>
        </div>
    );
};

export default ManageUser;
  