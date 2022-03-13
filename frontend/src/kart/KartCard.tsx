import styled from "styled-components";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { PublicKey } from "@solana/web3.js";
import { useStaker } from "~/staker/hooks";
import { NFTAccount } from "~/nft/hooks";
import { POOL_NAME } from "~/api/solana/constants";
import { upgradeKart } from "~/kart/services";
import { shortenIfAddress } from "~/wallet/utils";
import { useWorkspace } from "~/workspace/hooks";
import { useKartAccount } from "~/hooks/useAccount";
import { AppImage, Column, Paragraph } from "~/ui";
import Button from "~/ui/button/Button";
import { usePool } from "~/pool/hooks";
import { toastAPIError } from "~/utils";
import Card from "~/ui/card/Card";

const Select = styled.select`
  padding: 0.5rem;
  margin: 1rem;
  width: 100%;
  border-radius: 0.25rem;
`;

interface Props {
  nft: NFTAccount;
}

const KartCard: React.FC<Props> = ({ nft }) => {
  const { mint: kartMint, tokenAccountAddress: kartTokenAccount } = nft;
  const { stakers } = useStaker();
  const { provider } = useWorkspace();
  const { publicAddress: poolAccount } = usePool();

  const [selectedGarage, setSelectedGarage] = useState<PublicKey>();

  const {
    kartInfo,
    revalidate: revalidateKart,
    publicAddress,
    isInitialize,
    bump,
    isLoading: loadingKart,
  } = useKartAccount(POOL_NAME, kartMint);
  const [loading, setLoading] = useState<boolean>(false);

  const handleGarageChange: React.ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    if (e.target.value !== "") {
      setSelectedGarage(new PublicKey(e.target.value));
    } else {
      setSelectedGarage(undefined);
    }
  };

  const handleUpgrade = async () => {
    // if (!solRaceProgram || !provider) return
    if (!selectedGarage) {
      toast("Please select the garage to enhance your kart", {
        type: "warning",
      });
      return;
    }
    if (loadingKart || !poolAccount) {
      // not finish loading
      return;
    }

    setLoading(true);
    try {
      // we can ensure all ! field is exist by checking is loading
      const tx = await upgradeKart({
        provider,
        poolAccount,
        kartMint,
        kartAccount: publicAddress!,
        kartAccountBump: bump!,
        kartTokenAccount,
        stakingAccount: selectedGarage,
        isInitialize: isInitialize!,
      });
      const resp = await provider.connection.confirmTransaction(tx);
      if (resp.value.err) {
        toastAPIError(resp.value.err, "Fail! please try again");
      } else {
        toast("Congratulation! upgrade succeed", { type: "success" });
        await revalidateKart();
      }
    } catch (e) {
      toastAPIError(e, "Fail! please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <WrapperCardContent>
        {/* <h3>Mint: {shortenIfAddress(nft.mint.toBase58())}</h3>
        <p>Max Speed: {kartInfo?.masSpeed || 0}</p> */}
        <AppImage src="/kart-template.png" height="300px" width="350px" />
        {/* {selectedGarage ? (
          <p>{shortenIfAddress(selectedGarage.toBase58())}</p>
        ) : (
          <p>SELECT GARAGE</p>
        )} */}
        {/* <Select onChange={handleGarageChange}>
          <option value="">Please Select Garage</option>
          {stakers.map((staker) => (
            <option
              key={staker.publicAddress.toBase58()}
              value={staker.publicAddress.toBase58()}
            >
              {shortenIfAddress(staker.publicAddress.toBase58())} (100%)
            </option>
          ))}
        </Select> */}
        {/* {loading || loadingKart ? (
          <ReactLoading type="bubbles" color="#512da8" />
        ) : (
          <Button
            onClick={handleUpgrade}
            disabled={loading || loadingKart || !selectedGarage}
            color="secondary"
            width="100%"
            icon="upgrade"
            outline
          >
            Upgrade
          </Button>
        )} */}

        <WrapperDescription>
          <TextDescription>
            <Paragraph>Model: ZGMF-X42F Helios</Paragraph>
            <Paragraph>Rarity: AR</Paragraph>
            <Paragraph>Max Speed: 5</Paragraph>
          </TextDescription>
          <PriceDescription>
            <AppImage src="/sol-logo.png" width="25px" height="25px"></AppImage>

            <Paragraph>5.43</Paragraph>
          </PriceDescription>
        </WrapperDescription>
      </WrapperCardContent>
    </Card>
  );
};

const WrapperCardContent = styled.div`
  // needs this or else the background will be on top
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const WrapperDescription = styled.div`
  width: 100%;
  padding: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TextDescription = styled.div``;
const PriceDescription = styled.div`
  display: flex;
  gap: 0.5rem;
`;

export default KartCard;
