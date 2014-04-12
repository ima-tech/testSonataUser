<?php

/*
 * This file is part of the Sonata package.
 *
 * (c) Thomas Rabaix <thomas.rabaix@sonata-project.org>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

namespace Application\Sonata\UserBundle\Form\Handler;

use Symfony\Component\Form\Form;
use Symfony\Component\HttpFoundation\Request;

use FOS\UserBundle\Model\UserInterface;
use FOS\UserBundle\Model\UserManagerInterface;
use FOS\UserBundle\Form\Handler\RegistrationFormHandler as BaseHandler;
use Symfony\Component\Form\FormInterface;


use FOS\UserBundle\Mailer\MailerInterface;
use FOS\UserBundle\Util\TokenGeneratorInterface;


/**
 *
 * This file is an adapted version of FOS User Bundle RegistrationFormHandler class
 *
 *    (c) FriendsOfSymfony <http://friendsofsymfony.github.com/>
 */
class RegistrationFormHandler extends BaseHandler
{
    protected $request;
    protected $userManager;
    protected $form;
    protected $mailer;
    protected $tokenGenerator;

    public function __construct(FormInterface $form, Request $request, UserManagerInterface $userManager, MailerInterface $mailer, TokenGeneratorInterface $tokenGenerator)
    {

        $this->form = $form;
        $this->request = $request;
        $this->userManager = $userManager;
        $this->mailer = $mailer;
        $this->tokenGenerator = $tokenGenerator;
    }

    /**
     * @param boolean $confirmation
     */
    public function process($confirmation = false)
    {

        $user = $this->createUser();
        $this->form->setData($user);

        if ('POST' === $this->request->getMethod()) {

            $this->form->bind($this->request);
            if ($this->form->isValid()) {
                var_dump('working !!');
                $this->onSuccess($user, $confirmation);

                return true;
            }
            var_dump($this->form->getErrors());
        }

        return false;
    }

    /**
     * @param boolean $confirmation
     */
    protected function onSuccess(UserInterface $user, $confirmation)
    {
        if ($confirmation) {
            $user->setEnabled(false);
            if (null === $user->getConfirmationToken()) {
                $user->setConfirmationToken($this->tokenGenerator->generateToken());
            }

            $this->mailer->sendConfirmationEmailMessage($user);
        } else {
            $user->setEnabled(true);
        }

        $this->userManager->updateUser($user);
    }

    /**
     * @return UserInterface
     */
    protected function createUser()
    {
        return $this->userManager->createUser();
    }
}
