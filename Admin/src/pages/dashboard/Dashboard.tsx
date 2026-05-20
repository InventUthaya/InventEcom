import React, { useEffect, useState } from 'react';
import PageMeta from '../../components/common/PageMeta';
import Toaster, { ToastType } from '../../components/common/Toaster';
import Loader from '../../components/common/loader/Loader';
import IncompleteOrders from './IncompleteOrders';
import BestSellers from './BestSellers';
import CustomerRegistrationsChart from './CustomerRegistrationsChart';
import LatestOrders from './LatestOrders';
import Statistics from './Statistics';
import StatisticsCount from './StaticCount';

const Dashboard = () => {

    const [toast, setToast] = useState<{ msg: string; type: ToastType } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    return (
        <><React.Fragment>
            <PageMeta
                title="Dashboard | Dashboard"
                description="This is Dashboard page" />
            <Loader isOpen={isLoading} />
            {toast && (
                <Toaster
                    message={toast.msg}
                    type={toast.type}
                    onClose={() => setToast(null)} />
            )}
            <PageMeta
                title={`Dashboard | Dashboard`}
                description={`Dashboard`} />
        </React.Fragment>
            {/* <IncompleteOrders /> */}
            <StatisticsCount/>
            {/* <BestSellers />
            <CustomerRegistrationsChart />
            <LatestOrders />
            <Statistics /> */}

        </>
    );
};

export default Dashboard;