import { FaCaretDown } from 'react-icons/fa';
import { MdOutlineHome } from 'react-icons/md';
import { Dropdown, Tabs } from '../ui';
import { Outlet, useNavigate } from 'react-router-dom';
import { useState } from 'react';


const { TabNav, TabList, TabContent } = Tabs
const TabsBar = ({ tabs, content, MainDetail, TabOptions }: any) => {
  const { currentTab, setCurrentTab } = tabs;

  const [icon, setIcon] = useState(<MdOutlineHome size={26} />)
  function findLabelByPath(value: string): string | undefined {
    const menuEntries = Object.values(TabOptions);

    for (const entry of menuEntries) {
      if (entry.value === value) {
        return entry.label;
      }
    }
    return undefined;
  }


  return (
    <>
      <div className="mt-7">
        <Tabs value={currentTab} onChange={(val) => setCurrentTab(val)}>
          <div
            className={` md:bg-gray-100 md:dark:bg-gray-900 `}
          // stickyClass="dark:bg-gray-800 border-gray-200 dark:border-gray-700 stickyTabActual"
          >
            <div className="md:block hidden">
              <TabList className=" print:hidden">
                {TabOptions?.map((data, index) => (
                  <TabNav key={index} value={data?.value}>
                    {data?.label}
                  </TabNav>
                ))}
              </TabList>
            </div>
            <div className="md:hidden w-full flex items-center justify-center print:hidden text-lg cursor-pointer">
              <Dropdown
                renderTitle={
                  <span className="flex items-center w-full !rounded-none bg-gray-100 dark:bg-gray-900 font-semibold p-2">
                    <span>
                      {icon}

                    </span>
                    <span className={'ml-2 gap-1'}>{findLabelByPath(currentTab)}</span>
                    <FaCaretDown size={20} className="ms-auto" />
                  </span>
                }
                className="mr-2"
              >
                {TabOptions?.map((data, index) => (
                  <Dropdown.Item
                    key={index}
                    eventKey={data?.label}
                    className="text-base"
                    onClick={() => {
                      setCurrentTab(data?.value)
                      setIcon(data?.icon || icon)
                    }}
                  >
                    {data?.label}
                  </Dropdown.Item>
                ))}
              </Dropdown>
            </div>
          </div>

          <div className="bg-white p-4 dark:bg-gray-800 stickyPanel">
            {TabOptions?.map((data, index) => (
              <TabContent key={index} value={data?.value}>
                <div>{content[data?.value]}</div>
              </TabContent>
            ))}
          </div>
        </Tabs>
      </div>
      <Outlet />
    </>
  );
};

export default TabsBar;