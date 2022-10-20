import React, { useEffect, useState } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import PersistentDrawer from "../components/persistentDrawer";
import { getBrandApi } from "../API/api";
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
  const [tabVal, setTabVal] = useState(0);
  const [tabValIns, setTabValIns] = useState(0);
  const [mainTabVal, setMainTabVal] = useState(0);
  const [totalVal, setTotalVal] = useState(0);

  useEffect(() => {
    if(mainTabVal==0)
  {  tabVal == 0&& mainTabVal==0
      ? getBrandAllData("brand", "approved")
      : tabVal == 1
      ? getBrandAllData("brand", "pending")
      : tabVal == 2
      ? getBrandAllData("brand", "suspend")
      : getBrandAllData("brand");}
      else if(mainTabVal==1) {  tabValIns == 0&& mainTabVal==1
        ? getBrandAllData("influencer", "approved")
        : tabValIns == 1
        ? getBrandAllData("influencer", "pending")
        : tabValIns == 2
        ? getBrandAllData("influencer", "suspend")
        : getBrandAllData("influencer");}
  }, [pageState.page, pageState.pageSize]);

  const getBrandAllData = async (brand, status) => {
    console.log("getBrandAllData", pageState.pageSize, pageState.page);
    setPageState((old) => ({ ...old, isLoading: true }));
    const response = await getBrandApi(
      pageState.pageSize,
      pageState.page,
      brand,
      status
    );

    setarr(response.data.user);

    setPageState((old) => ({
      ...old,
      total: response.data.total_records,
      isLoading: false,
    }));
    setTotalVal(response.data.total_records);
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
          <Tab onClick={() => {
            setMainTabVal(0)
          }}>Brand</Tab>
          <Tab onClick={() => {
            setMainTabVal(1)
          }}>Influencer</Tab>
        </TabList>
        <TabPanel>
          <Tabs>
            <TabList>
              <Tab
                onClick={() => {
                  setTabVal(0);
                  getBrandAllData("brand", "approved");
                }}
              >
                Approve : {totalVal}
              </Tab>
              <Tab
                onClick={() => {
                  setTabVal(1);
                  getBrandAllData("brand", "pending");
                }}
              >
                Pending : {totalVal}
              </Tab>

              <Tab
                onClick={() => {
                  setTabVal(2);
                  getBrandAllData("brand", "suspend");
                }}
              >
                Suspend : {totalVal}
              </Tab>
              <Tab
                onClick={() => {
                  setTabVal(3);
                  getBrandAllData("brand");
                }}
              >
                All : {totalVal}
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
              <Tab
                onClick={() => {
                  setTabValIns(0);
                  getBrandAllData("influencer", "approved");
                }}
              >
                Approve : {totalVal}
              </Tab>
              <Tab
                onClick={() => {
                  setTabValIns(1);
                  getBrandAllData("influencer", "pending");
                }}
              >
                Pending : {totalVal}
              </Tab>

              <Tab
                onClick={() => {
                  setTabValIns(2);
                  getBrandAllData("influencer", "suspend");
                }}
              >
                Suspend : {totalVal}
              </Tab>
              <Tab
                onClick={() => {
                  setTabValIns(3);
                  getBrandAllData("influencer");
                }}
              >
                All : {totalVal}
              </Tab>
            </TabList>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
            <TabPanel>{data}</TabPanel>
          </Tabs>
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default Profile;
