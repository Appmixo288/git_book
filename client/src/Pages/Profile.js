import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PersistentDrawer from "../components/persistentDrawer";
import { getUserApi } from "../API/api";

import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const Profile = () => {
  const [arr, setarr] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    console.log("call api dtaa");
    let responce = await getUserApi();
    // console.log("fuytfty", responce.data);
    setarr(responce.data.user);
  };

  const columns = [
    {
      field: "id",
      headerName: "id",
      width: "100px",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "phone",
      width: "100px",
      minWidth: 80,
      flex: 1,
    },

    {
      field: "createdAt",
      headerName: "createdAt",
      width: "100px",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "status",
      headerName: "status",
      width: "100px",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "type_of_user",
      headerName: "type_of_user",
      width: "100px",
      minWidth: 80,
      flex: 1,
    },
    {
      field: "updatedAt",
      headerName: "updatedAt",
      width: "100px",
      minWidth: 80,
      flex: 1,
    },
    { field: "brand_createdAt", headerName: "brand createdAt", width: 90 },
    {
      field: "brand_type_of_brand",
      headerName: "brand type_of_brand",
      width: 90,
    },
    { field: "brand_user_id", headerName: "brand user_id", width: 90 },
    { field: "brand_updatedAt", headerName: "brand updatedAt", width: 90 },
  ];
  const rows = [];
const i=0;
  console.log("array", arr);
  arr.map((item, i) => {
    return rows.push({
      id: i++,
      phone: item?.phone,
      createdAt: item?.createdAt,
      status: item?.status,
      type_of_user: item?.type_of_user,
      updatedAt: item?.updatedAt,
      brand_createdAt: item?.brands?.createdAt,
      brand_type_of_brand: item?.brands?.type_of_brand,
      brand_user_id: item?.brands?.user_id,
      brand_updatedAt: item?.brands?.updatedAt,
    });
  });

  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <PersistentDrawer />
      {/* <Tabs>
            <TabList>
              <Tab >Brand</Tab>
              <Tab>Influencer</Tab>
            </TabList>
            <TabPanel>
              <Tabs>
                <TabList>
                  <Tab>Approve</Tab>
                  <Tab>Pending</Tab>
                  <Tab>Suspend</Tab>
                  <Tab>All</Tab>
                </TabList>
                <TabPanel>
                  <Tab>Approve</Tab>
                </TabPanel>
                <TabPanel>
                  <Tab>Pending</Tab>
                </TabPanel>
                <TabPanel>
                  <Tab>Suspend</Tab>
                </TabPanel>
                <TabPanel>
              
                <Tab>All</Tab>
                </TabPanel>
              </Tabs>
            </TabPanel>
            <TabPanel>
              <Tabs>
                <TabList>
                  <Tab>Approve</Tab>
                  <Tab>Pending</Tab>
                  <Tab>Suspend</Tab>
                  <Tab>All</Tab>
                </TabList>
                <TabPanel>
                  <Tab>Approve</Tab>
                </TabPanel>
                <TabPanel>
                  <Tab>Pending</Tab>
                </TabPanel>
                <TabPanel>
                  <Tab>Suspend</Tab>
                </TabPanel>
                <TabPanel>
                  <Tab>All</Tab>
                </TabPanel>
              </Tabs>
            </TabPanel>
          </Tabs> */}

      <Box sx={{ height: 630, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  );
};

export default Profile;
