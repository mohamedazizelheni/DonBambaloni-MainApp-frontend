// pages/shops/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getEntityDetails } from '@/services/entityService';
import Spinner from '@/components/common/Spinner';
import Image from 'next/image';
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@headlessui/react';
import clsx from 'clsx';
import { RoleColors } from '@/utils/constants';

const ShopDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [shopDetails, setShopDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchDetails = async () => {
        try {
          const data = await getEntityDetails('shops', id);
          setShopDetails(data.shop);
          setLoading(false);
        } catch (err) {
          setError('Failed to fetch shop details.');
          setLoading(false);
        }
      };
      fetchDetails();
    }
  }, [id]);

  if (loading) return <Spinner />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto  p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 ">
        {/* Image Section */}
        <div className="relative w-full lg:h-[90vh] h-[300px] bg-gray-200 rounded-lg shadow-lg overflow-hidden">
          {shopDetails?.image && (
            <Image
              src={`${process.env.NEXT_PUBLIC_API_IMAGE_URL}/${shopDetails?.image}`}
              layout="fill"
              objectFit="cover"
              alt={shopDetails?.name}
            />
          )}
        </div>

        {/* Details Section */}
        <div className=" flex flex-col space-y-6">
          <h1 className="text-4xl font-bold text-gray-800">{shopDetails?.name}</h1>
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Address: </span> {shopDetails?.address}
          </p>

          {/* Operating Shifts */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">Operating Shifts</h2>
            <div className="flex space-x-2">
              {shopDetails?.operatingShifts.map((shift) => (
                <span
                  key={shift}
                  className={clsx(
                    'px-3 py-1 rounded-full text-sm font-medium',
                    shift === 'Morning' && 'bg-yellow-100 text-yellow-600',
                    shift === 'Afternoon' && 'bg-blue-100 text-blue-600',
                    shift === 'Night' && 'bg-gray-100 text-gray-600'
                  )}
                >
                  {shift}
                </span>
              ))}
            </div>
          </div>

          {/* Team by Shifts */}
          <div className="mt-6">
            <TabGroup>
              <TabList className="flex space-x-4">
                {shopDetails?.operatingShifts.map((shift) => (
                  <Tab
                    key={shift}
                    className={({ selected }) =>
                      clsx(
                        'px-4 py-2 rounded-lg text-sm font-medium',
                        selected
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      )
                    }
                  >
                    {shift} Team
                  </Tab>
                ))}
              </TabList>
              <TabPanels className="mt-6">
                {shopDetails?.operatingShifts.map((shift) => (
                  <TabPanel key={shift}>
                    <div className="bg-white p-4 rounded-lg shadow-md">
                      <h3 className="text-lg font-semibold mb-3">{shift} Shift Team</h3>
                      {shopDetails?.teams[shift]?.length > 0 ? (
                        <ul className="space-y-2">
                          {shopDetails.teams[shift].map((user) => (
                            <li
                              key={user._id}
                              className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100"
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                                  <span className="text-lg font-bold text-gray-600">
                                    {user.username.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-gray-800 font-medium">{user.username}</p>
                                  <span className={`px-2  rounded-full text-[12px] font-semibold ${RoleColors[user.role]}`}>
                    {user.role}
                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No team assigned to this shift.</p>
                      )}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
