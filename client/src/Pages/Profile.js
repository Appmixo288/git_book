import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PersistentDrawer from "../components/persistentDrawer";
import {
  getBrandApproveApi,
  getBrandPendingApi,
  getBrandSuspendApi,
  getBrandAllApi,
} from "../API/api";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const Profile = () => {
  const [arr, setarr] = useState([]);
  const [pageState, setPageState] = useState({
    isLoading: false,
    total: 0,
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    getBrandApproveData();
  }, [pageState.page, pageState.pageSize]);

  const getBrandApproveData = async () => {
    console.log("getBrandApproveData");
    setPageState((old) => ({ ...old, isLoading: true }));
    const response = await getBrandApproveApi();
    setarr(response.data.user);

    setPageState((old) => ({
      ...old,
      total: response.data.total_records,
      isLoading: false,
      data: response.data,
    }));
  };

  const getBrandPendingData = async () => {
    console.log("getBrandPendingData");
    setPageState((old) => ({ ...old, isLoading: true }));
    const response = await getBrandPendingApi();
    setarr(response.data.user);

    setPageState((old) => ({
      ...old,
      total: response.data.total_records,
      isLoading: false,
      data: response.data,
    }));
  };

  const getBrandSuspendData = async () => {
    console.log("getBrandSuspendData");
    setPageState((old) => ({ ...old, isLoading: true }));
    const response = await getBrandSuspendApi();

    setarr(response.data.user);

    setPageState((old) => ({
      ...old,
      total: response.data.total_records,
      isLoading: false,
      data: response.data,
    }));
  };

  const getBrandAllData = async () => {
    console.log("getBrandAllData");
    setPageState((old) => ({ ...old, isLoading: true }));
    const response = await getBrandAllApi();

    setarr(response.data.user);

    setPageState((old) => ({
      ...old,
      total: response.data.total_records,
      isLoading: false,
      data: response.data,
    }));
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

  arr.map((item, i) => {
    return rows.push({
      id: i + 1,
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

  const data =
    arr.length == 0 ? (
      <div>
        <h1 style={{ textAlign: "center" }}>No Data Found</h1>
      </div>
    ) : (
      <Box sx={{ height: 630, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          rowCount={pageState.total}
          loading={pageState.isLoading}
          rowsPerPageOptions={[10]}
          pagination
          page={pageState.page - 1}
          pageSize={pageState.pageSize}
          paginationMode="server"
          onPageChange={(newPage) => {
            setPageState((old) => ({ ...old, page: newPage + 1 }));
          }}
          onPageSizeChange={(newPageSize) =>
            setPageState((old) => ({ ...old, pageSize: newPageSize }))
          }
        />
      </Box>
    );

  return (
    <div style={{ padding: "10px" }}>
      <PersistentDrawer />
      <Tabs>
        <TabList>
          <Tab>Brand</Tab>
          <Tab>Influencer</Tab>
        </TabList>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab
                onClick={() => {
                  getBrandApproveData();
                }}
              >
                Approve
              </Tab>
              <Tab
                onClick={() => {
                  getBrandPendingData();
                }}
              >
                Pending
              </Tab>

              <Tab
                onClick={() => {
                  getBrandSuspendData();
                }}
              >
                Suspend
              </Tab>
              <Tab
                onClick={() => {
                  getBrandAllData();
                }}
              >
                All
              </Tab>
            </TabList>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
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
      </Tabs>
    </div>
  );
};

export default Profile;
