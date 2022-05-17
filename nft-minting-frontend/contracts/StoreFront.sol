// SPDX-License-Identifier: Apache-2.0

pragma solidity ^0.8.0;

import "./utils/introspection/IERC165.sol";
import "./ERC721/IERC721Receiver.sol";
import "./ERC721/IERC721Metadata.sol";
import "./utils/access/Ownable.sol";
import "./utils/Address.sol";
import "./utils/Strings.sol";
import "./utils/introspection/ERC165.sol";
import "./utils/Base58.sol";

contract StoreFront is Ownable, ERC165, IERC721, IERC721Metadata{
	event Buy( address _owner, uint[] _tokens, uint _price );

	using Address for address;
	using Strings for uint;
	using Base58 for bytes;

	string public override name;
	string public override symbol;
	mapping(uint => address) private _owners;
	mapping(uint => address) public  creaters;
	mapping(address => uint) private _balances;
	mapping(uint => address) private _tokenApprovals;
	mapping(address => mapping(address => bool)) private _operatorApprovals;

	

	address public immutable signerAddress;
	uint public immutable totalSupply;
	uint public immutable maxPerWallet;
	uint public totalSales = 0;
	string private baseUri;
	

	constructor() Ownable() {
		signerAddress = 0xaFa52348CeD7B0dA15016096240f6Cd6AE51203c;
		baseUri = "https://ipfs.io/ipfs";
		maxPerWallet = 20;
		totalSupply = 1e3;
		name = "myNFT";
		symbol = "TNFT";
	}

	function supportsInterface(bytes4 interfaceId) public view virtual override(ERC165, IERC165) returns (bool) {
		return interfaceId == type(IERC721).interfaceId || interfaceId == type(IERC721Metadata).interfaceId || super.supportsInterface(interfaceId);
	}
	
	function balanceOf(address _owner) public view override returns (uint) {
		require( _owner != address(0), "ERC721: balance query for the zero address" );
		// if (_owner==owner()) return totalSupply - totalSales;
		return _balances[_owner];
	}

	function ownerOf(uint tokenId) public view override returns (address) {
		address _owner = _owners[tokenId];
		// if (_owner != address(0)) return _owner;
		require( _owner != address(0), "ERC721: creater query for nonexistent token" );
		return _owners[tokenId];
	}

	function createrOf(uint tokenId) public view override returns (address) {
		address creater = creaters[tokenId];
		require( creater != address(0), "ERC721: owner query for nonexistent token" );
		return creater;
	}

	/* function name() public view virtual override returns (string memory) {
		return _name;
	}

	function symbol() public view virtual override returns (string memory) {
		return _symbol;
	} */

	function approve(address to, uint tokenId) public override {
		address _owner = ownerOf(tokenId);
		require(to != _owner, "ERC721: approval to current owner");

		require( _msgSender() == _owner || isApprovedForAll(_owner, _msgSender()), "ERC721: approve caller is not owner nor approved for all" );

		_approve(to, tokenId);
	}

	function getApproved(uint tokenId) public view virtual override returns (address) {
		require( _exists(tokenId), "ERC721: approved query for nonexistent token" );
		return _tokenApprovals[tokenId];
	}

	function isApprovedForAll(address owner, address operator) public view virtual override returns (bool) {
		return _operatorApprovals[owner][operator];
	}

	function setApprovalForAll(address operator, bool approved) public virtual override {
		require(operator != _msgSender(), "ERC721: approve to caller");

		_operatorApprovals[_msgSender()][operator] = approved;
		emit ApprovalForAll(_msgSender(), operator, approved);
	}

	function transferFrom( address from, address to, uint tokenId ) public virtual override {
		//solhint-disable-next-line max-line-length
		require( _isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved" );

		_transfer(from, to, tokenId);
	}
	
	function safeTransferFrom( address from, address to, uint tokenId ) public virtual override {
		safeTransferFrom(from, to, tokenId, "");
	}

	function safeTransferFrom( address from, address to, uint tokenId, bytes memory _data ) public virtual override {
		require( _isApprovedOrOwner(_msgSender(), tokenId), "ERC721: transfer caller is not owner nor approved" );
		_safeTransfer(from, to, tokenId, _data);
	}


	function _safeTransfer( address from, address to, uint tokenId, bytes memory _data ) internal virtual {
		_transfer(from, to, tokenId);
		require( _checkOnERC721Received(from, to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer" );
	}

	function _exists(uint tokenId) internal view virtual returns (bool) {
		return _owners[tokenId] != address(0);
	}

	function _isApprovedOrOwner(address spender, uint tokenId) internal view virtual returns (bool) {
		require( _exists(tokenId), "ERC721: operator query for nonexistent token" );
		address owner = ownerOf(tokenId);
		return (spender == owner || getApproved(tokenId) == spender || isApprovedForAll(owner, spender));
	}
	
	/* function _safeMint(address to, uint tokenId) internal virtual {
		_safeMint(to, tokenId, "");
	}

	function _safeMint( address to, uint tokenId, bytes memory _data ) internal virtual {
		_mint(to, tokenId);
		require( _checkOnERC721Received(address(0), to, tokenId, _data), "ERC721: transfer to non ERC721Receiver implementer" );
	}

	function _mint(address to, uint tokenId) internal virtual {
		require(to != address(0), "ERC721: mint to the zero address");
		require(!_exists(tokenId), "ERC721: token already minted");

		_beforeTokenTransfer(address(0), to, tokenId);

		_balances[to] += 1;
		_owners[tokenId] = to;
		creaters[tokenId] = to;

		emit Transfer(address(0), to, tokenId);
	} */

	/* function _burn(uint tokenId) internal virtual {
		address owner = ownerOf(tokenId);

		_beforeTokenTransfer(owner, address(0), tokenId);
		_approve(address(0), tokenId);

		_balances[owner] -= 1;
		delete _owners[tokenId];

		emit Transfer(owner, address(0), tokenId);
	} */

	function _transfer( address from, address to, uint tokenId ) internal virtual {
		require( ownerOf(tokenId) == from, "ERC721: transfer of token that is not own" );
		require(to != address(0), "ERC721: transfer to the zero address");

		_beforeTokenTransfer(from, to, tokenId);

		// Clear approvals from the previous owner
		_approve(address(0), tokenId);

		_balances[from] -= 1;
		_balances[to] += 1;
		_owners[tokenId] = to;

		emit Transfer(from, to, tokenId);
	}

	function _approve(address to, uint tokenId) internal virtual {
		_tokenApprovals[tokenId] = to;
		emit Approval(ownerOf(tokenId), to, tokenId);
	}


	function _checkOnERC721Received( address from, address to, uint tokenId, bytes memory _data ) private returns (bool) {
		if (to.isContract()) {
			try
				IERC721Receiver(to).onERC721Received( _msgSender(), from, tokenId, _data ) returns (bytes4 retval) {
					return retval == IERC721Receiver(to).onERC721Received.selector;
				} catch (bytes memory reason) {
					if (reason.length == 0) {
						revert ("ERC721: transfer to non ERC721Receiver implementer");
					} else {
						assembly {
							revert(add(32, reason), mload(reason))
						}
					}
				}
		} else {
			return true;
		}
	}

	function _beforeTokenTransfer( address from, address to, uint tokenId ) internal virtual {}    

	function buy( uint[] memory _tokens, uint _price, bytes memory _signature) public payable {
		uint count = 0;
		require(msg.sender != address(0), "ERC721: mint to the zero address");
		require(verify(_tokens, _price, _signature), "invalid params");
		for (uint k=0; k<_tokens.length; k++) {
			uint _tokenId = _tokens[k];
			if (_owners[_tokenId] == address(0)) {
				_balances[msg.sender] += 1;
				_owners[_tokenId] = msg.sender;
				creaters[_tokenId] = msg.sender;
				emit Transfer(address(0), msg.sender, _tokenId);
				count++;
			}
		}
		require(count + _balances[msg.sender] <= 20, "your wallet reach out limit.");
		uint _amount = count * _price;
		require(msg.value>=_amount, "value is less than total amount");
		uint _remain = msg.value - _amount;
		if (_remain>0) {
			bool sent;
			bytes memory data;
			(sent, data) = msg.sender.call{value: _remain}("");
		}

		totalSales += count;
		emit Buy( msg.sender, _tokens, _price );
	}

	/* ------------- view ---------------*/

	function tokenURI(uint tokenId) external view returns (string memory) {
		bytes memory src = new bytes(32);
    	assembly { mstore(add(src, 32), tokenId) }
		bytes memory dst = new bytes(34);
		dst[0] = 0x12;
		dst[1] = 0x20;
		for(uint i=0; i<32; i++) {
			dst[i + 2] = src[i];
		}
		return string(abi.encodePacked(baseUri, "/",  dst.toBase58()));
	}

	function getMessageHash(uint[] memory _tokens, uint _price) public pure returns (bytes32) {
		 return keccak256(abi.encodePacked(_tokens, _price));
	}

	function verify(uint[] memory _tokens, uint _price, bytes memory _signature) public view returns (bool) {
		bytes32 messageHash = getMessageHash(_tokens, _price);
		bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
		return recoverSigner(ethSignedMessageHash, _signature) == signerAddress;
	}
	
	function getEthSignedMessageHash(bytes32 _messageHash) internal pure returns (bytes32) {
		return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
	}

	function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) internal pure returns (address) {
		(bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);
		return ecrecover(_ethSignedMessageHash, v, r, s);
	}
	
	function splitSignature(bytes memory sig) internal pure returns (bytes32 r,bytes32 s,uint8 v) {
		require(sig.length == 65, "invalid signature length");
				assembly {
			r := mload(add(sig, 32))
			s := mload(add(sig, 64))
			v := byte(0, mload(add(sig, 96)))
		}
	}
}
