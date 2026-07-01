package com.hotel.booking.service;

import com.hotel.booking.dto.ContactDTO;
import com.hotel.booking.dto.ContactReplyRequest;
import com.hotel.booking.dto.ContactRequest;
import com.hotel.booking.entity.Contact;
import com.hotel.booking.entity.Contact.ContactStatus;
import com.hotel.booking.entity.User;
import com.hotel.booking.repository.ContactRepository;
import com.hotel.booking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactRepository contactRepository;
    private final UserRepository userRepository;

    /*
     * Khách hàng gửi liên hệ.
     */
    @Transactional
    public ContactDTO createContact(
            String userEmail,
            ContactRequest request
    ) {
        User user = findUserByEmail(userEmail);

        Contact contact = Contact.builder()
                .user(user)
                .fullName(request.getFullName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .subject(request.getSubject())
                .content(request.getContent())
                .status(ContactStatus.PENDING)
                .readByUser(true)
                .build();

        Contact savedContact = contactRepository.save(contact);

        return convertToDTO(savedContact);
    }

    /*
     * Khách hàng xem toàn bộ liên hệ và phản hồi của mình.
     */
    @Transactional(readOnly = true)
    public List<ContactDTO> getMyContacts(String userEmail) {
        User user = findUserByEmail(userEmail);

        return contactRepository
                .findByUserOrderByCreatedAtDesc(user)
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    /*
     * Đếm số phản hồi chưa đọc của khách hàng.
     */
    @Transactional(readOnly = true)
    public long getUnreadCount(String userEmail) {
        User user = findUserByEmail(userEmail);

        return contactRepository
                .countByUserAndStatusAndReadByUserFalse(
                        user,
                        ContactStatus.REPLIED
                );
    }

    /*
     * Khách hàng đánh dấu một phản hồi là đã đọc.
     */
    @Transactional
    public ContactDTO markAsRead(
            Long contactId,
            String userEmail
    ) {
        User user = findUserByEmail(userEmail);

        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy liên hệ")
                );

        /*
         * Không cho tài khoản này đọc liên hệ của tài khoản khác.
         */
        if (!contact.getUser().getId().equals(user.getId())) {
            throw new RuntimeException(
                    "Bạn không có quyền xem liên hệ này"
            );
        }

        contact.setReadByUser(true);

        Contact savedContact = contactRepository.save(contact);

        return convertToDTO(savedContact);
    }

    /*
     * Admin lấy toàn bộ liên hệ.
     */
    @Transactional(readOnly = true)
    public List<ContactDTO> getAllContacts() {
        return contactRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::convertToDTO)
                .toList();
    }

    /*
     * Admin xem chi tiết một liên hệ.
     */
    @Transactional(readOnly = true)
    public ContactDTO getContactById(Long contactId) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy liên hệ")
                );

        return convertToDTO(contact);
    }

    /*
     * Admin trả lời khách hàng.
     */
    @Transactional
    public ContactDTO replyContact(
            Long contactId,
            ContactReplyRequest request
    ) {
        Contact contact = contactRepository.findById(contactId)
                .orElseThrow(() ->
                        new RuntimeException("Không tìm thấy liên hệ")
                );

        contact.setAdminReply(request.getReply());
        contact.setStatus(ContactStatus.REPLIED);
        contact.setRepliedAt(LocalDateTime.now());

        /*
         * Sau khi Admin trả lời,
         * đặt false để khách hàng thấy thông báo chưa đọc.
         */
        contact.setReadByUser(false);

        Contact savedContact = contactRepository.save(contact);

        return convertToDTO(savedContact);
    }

    private User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Không tìm thấy tài khoản người dùng"
                        )
                );
    }

    private ContactDTO convertToDTO(Contact contact) {
        return ContactDTO.builder()
                .id(contact.getId())
                .userId(contact.getUser().getId())
                .fullName(contact.getFullName())
                .email(contact.getEmail())
                .phone(contact.getPhone())
                .subject(contact.getSubject())
                .content(contact.getContent())
                .status(contact.getStatus().name())
                .adminReply(contact.getAdminReply())
                .readByUser(contact.getReadByUser())
                .createdAt(contact.getCreatedAt())
                .repliedAt(contact.getRepliedAt())
                .build();
    }
}