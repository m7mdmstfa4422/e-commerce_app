import { useQuery } from "@tanstack/react-query"
import axios from "axios"


export default function useApi(endPoint) {

    function getApiFun() {
        return axios.get(`https://ecommerce.routemisr.com/api/v1/${endPoint}`)
    }

    let { data, isLoading, error, isError } = useQuery({
        queryKey: ['endPoint'],
        queryFn: getApiFun
    })
    return { data, isLoading, error, isError }
}
